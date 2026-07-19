const express = require("express");
const router = express.Router();
const User = require("../../app/models/User");

// VULNERABLE — spreads entire req.body into User.create,
// so a client can pass role: "admin" directly
router.post("/register", async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(201).json({ message: "Account created", user });
});

module.exports = router;
