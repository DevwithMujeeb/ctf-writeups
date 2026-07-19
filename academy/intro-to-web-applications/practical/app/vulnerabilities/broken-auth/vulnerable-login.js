const express = require("express");
const router = express.Router();
const User = require("../../app/models/User");

// VULNERABLE — plaintext comparison, no lockout, no bcrypt
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: `Invalid password for ${username}` });
  }

  res.status(200).json({ message: "Login successful" });
});

module.exports = router;
