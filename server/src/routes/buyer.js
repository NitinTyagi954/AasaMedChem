import express from "express";
import pool from "../db/index.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Middleware to check if user is a buyer
const authorizeBuyer = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ success: false, error: "Available to buyers only" });
  }
  next();
};

// @route   GET /api/buyer/catalog
// @desc    Get all approved products for buyers to browse
// @access  Private (Buyer)
router.get("/catalog", authenticate, authorizeBuyer, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.*, u.name as seller_name 
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'approved' AND p.stock_in_base_unit > 0
      ORDER BY p.created_at DESC
      `
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/buyer/orders
// @desc    Get all orders placed by the current buyer
// @access  Private (Buyer)
router.get("/orders", authenticate, authorizeBuyer, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT o.*, u.name as seller_name
      FROM orders o
      JOIN users u ON o.seller_id = u.id
      WHERE o.buyer_id = $1
      ORDER BY o.created_at DESC
      `,
      [req.user.id]
    );
    
    // We also want to fetch order items for each order if needed, 
    // but a basic list is fine for the main dashboard.
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/buyer/orders
// @desc    Place a new order (checkout cart)
// @access  Private (Buyer)
router.post("/orders", authenticate, authorizeBuyer, async (req, res) => {
  // Items will be an array of: { productId, sellerId, quantity, baseUnit, price, displayName }
  // Since an order belongs to ONE seller in our schema (seller_id in orders table),
  // we must split the cart by seller and create multiple orders, or assume cart is single-seller.
  // We'll group by seller and create one order per seller.
  
  const client = await pool.connect();
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    await client.query('BEGIN');
    
    // Group items by seller
    const itemsBySeller = items.reduce((acc, item) => {
      if (!acc[item.seller_id]) acc[item.seller_id] = [];
      acc[item.seller_id].push(item);
      return acc;
    }, {});

    const createdOrders = [];

    // Create an order for each seller
    for (const sellerId in itemsBySeller) {
      const sellerItems = itemsBySeller[sellerId];
      
      // Calculate total for this seller's order
      let orderTotal = 0;
      for (const item of sellerItems) {
        orderTotal += item.quantity * item.price_per_base_unit;
      }

      // Create Order
      const orderRes = await client.query(
        `
        INSERT INTO orders (buyer_id, seller_id, total_amount, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING *
        `,
        [req.user.id, sellerId, orderTotal]
      );
      
      const orderId = orderRes.rows[0].id;

      // Insert order items & update product stock
      for (const item of sellerItems) {
        const lineTotal = item.quantity * item.price_per_base_unit;
        
        await client.query(
          `
          INSERT INTO order_items (order_id, product_id, display_unit, display_quantity, quantity_base, unit_price_snapshot, line_total)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [
            orderId, 
            item.id, 
            item.base_unit, 
            item.quantity, 
            item.quantity, 
            item.price_per_base_unit, 
            lineTotal
          ]
        );

        // Reduce stock
        await client.query(
          `
          UPDATE products
          SET stock_in_base_unit = stock_in_base_unit - $1
          WHERE id = $2
          `,
          [item.quantity, item.id]
        );
      }
      
      createdOrders.push(orderRes.rows[0]);
    }

    await client.query('COMMIT');
    return res.status(201).json({ success: true, data: createdOrders });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

export default router;
