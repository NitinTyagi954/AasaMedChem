import express from "express";
import pool from "../db/index.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Middleware to check if user is a seller
const authorizeSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ success: false, error: "Available to sellers only" });
  }
  next();
};

// @route   GET /api/seller/orders
// @desc    Get all orders placed for this seller's products
// @access  Private (Seller)
router.get("/orders", authenticate, authorizeSeller, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT o.*, u.name as buyer_name, u.email as buyer_email
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id = $1
      ORDER BY o.created_at DESC
      `,
      [req.user.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/seller/orders/:id/status
// @desc    Update an order's status (e.g. to 'processing', 'fulfilled')
// @access  Private (Seller)
router.put("/orders/:id/status", authenticate, authorizeSeller, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'processing', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status update" });
    }

    const result = await pool.query(
      `
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND seller_id = $3
      RETURNING *
      `,
      [status, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
