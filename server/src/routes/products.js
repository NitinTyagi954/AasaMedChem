import express from "express";
import pool from "../db/index.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// @route   POST /api/products
// @desc    Seller creates a new product (defaults to 'pending')
// @access  Private (Seller only)
router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ success: false, error: "Only sellers can create products" });
    }

    const {
      name,
      sku,
      category,
      description,
      base_unit,
      price_per_base_unit,
      stock_in_base_unit,
    } = req.body;

    // Validate required fields
    if (!name || !base_unit || price_per_base_unit === undefined || stock_in_base_unit === undefined) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Insert into DB
    const finalSku = sku && sku.trim() !== "" ? sku.trim() : null;

    const result = await pool.query(
      `
      INSERT INTO products 
      (seller_id, name, sku, category, description, base_unit, price_per_base_unit, stock_in_base_unit, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *
      `,
      [req.user.id, name, finalSku, category, description, base_unit, price_per_base_unit, stock_in_base_unit]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    // Handle unique SKU violation correctly
    if (err.code === "23505" && err.constraint === "products_sku_key") {
      return res.status(400).json({ success: false, error: "SKU already exists" });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/products/seller
// @desc    Get all products for the logged in seller
// @access  Private (Seller only)
router.get("/seller", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ success: false, error: "Only sellers can view their products here" });
    }

    const result = await pool.query(
      `
      SELECT * FROM products
      WHERE seller_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
