const express = require("express");
const router = express.Router();
const User = require("../../app/models/User");
const { requireAuth } = require("../../app/middleware/auth");

// VULNERABLE — any authenticated user can fetch ANY user by ID,
// no ownership or role check
router.get("/users/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ user });
});

module.exports = router;
