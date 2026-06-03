import express from "express";
import pool from "../db/index.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Middleware to check if user is admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Available to admins only" });
  }
  next();
};

// @route   GET /api/admin/products/pending
// @desc    Get all pending products waiting for approval
router.get("/products/pending", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.*, u.name as seller_name, u.email as seller_email 
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
      `
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/admin/products/:id/status
// @desc    Approve or reject a product listing
router.put("/products/:id/status", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status update" });
    }

    const result = await pool.query(
      `
      UPDATE products 
      SET status = $1, rejection_reason = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [status, status === 'rejected' ? rejection_reason : null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users in the system
router.get("/users", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, role, is_active, created_at 
      FROM users
      ORDER BY created_at DESC
      `
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders across the system
router.get("/orders", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT o.*, b.name as buyer_name, s.name as seller_name
      FROM orders o
      LEFT JOIN users b ON o.buyer_id = b.id
      LEFT JOIN users s ON o.seller_id = s.id
      ORDER BY o.created_at DESC
      `
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;