const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ============================================
// USER ROUTES
//
// SECURITY NOTE: In a real application every
// route here would require authentication and
// authorization middleware. These are left open
// for demonstration purposes only.
// ============================================

// GET /api/users
// SECURITY NOTE: Never return password hashes.
// Never return unbounded lists — always paginate.
// This endpoint should require admin auth in production.
router.get("/", async (req, res) => {
  try {
    // password excluded automatically (select: false)
    const users = await User.find().select("-__v");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET /api/users/:id
// SECURITY NOTE: This is an IDOR vulnerability
// if not properly authorized — any authenticated
// user can access any other user's data by changing
// the ID in the URL. Always verify the requesting
// user is authorized to access the requested resource.
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    // SECURITY NOTE: An invalid MongoDB ObjectId
    // throws a CastError — handle it gracefully
    // rather than leaking the error to the client.
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
