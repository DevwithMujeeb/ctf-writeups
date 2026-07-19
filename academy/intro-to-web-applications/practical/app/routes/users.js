const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

// ============================================
// USER ROUTES
//
// Demonstrates two access control patterns:
// 1. requireAuth — any authenticated user
// 2. requireRole('admin') — admin only
//
// SECURITY NOTE: Authorization checks happen
// server-side in middleware — never trust the
// client to send their own role or permissions.
// ============================================

// GET /api/users
// Admin only — lists all users
// SECURITY NOTE: User listing is sensitive data.
// Regular members should never see all accounts.
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET /api/users/profile
// Any authenticated user — returns own profile only
// SECURITY NOTE: This endpoint only returns the
// requesting user's own data — no IDOR risk since
// the user ID comes from the verified JWT, not
// from user-controlled input.
router.get("/profile", requireAuth, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

// GET /api/users/:id
// IDOR demonstration — intentionally vulnerable
// SECURITY NOTE: This endpoint accepts a user ID
// from the URL — any authenticated user can access
// any other user's data by changing the ID.
// This is an Insecure Direct Object Reference (IDOR).
// The fix: verify req.user._id matches req.params.id
// OR require admin role.
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // IDOR VULNERABILITY: No check that the
    // requesting user owns this resource
    res.status(200).json({ user });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
