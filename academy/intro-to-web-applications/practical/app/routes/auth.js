const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ============================================
// AUTH ROUTES — SECURE VERSION
//
// This replaces the hardcoded demo credentials
// from Step 4 with real database lookups,
// bcrypt password comparison, and brute-force
// protection using the User model methods.
// ============================================

// POST /api/auth/register
// Creates a new user account.
// SECURITY NOTE: Password is hashed automatically
// by the pre-save hook in the User model —
// we never touch the plaintext password here.
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Check for existing user
    // SECURITY NOTE: Generic message — don't reveal
    // whether the username or email already exists.
    // Specific messages enable account enumeration.
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return res.status(409).json({
        message: "An account with those credentials already exists",
      });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// POST /api/auth/login
// SECURITY NOTE: Three layers of protection here:
// 1. Generic error message — same response whether
//    username doesn't exist or password is wrong
// 2. Account lockout — blocks after 5 failed attempts
// 3. bcrypt comparison — timing-safe password check
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Must explicitly select password since
    // it has select: false in the schema
    const user = await User.findOne({ username }).select("+password");

    // Generic message — same for wrong username
    // and wrong password deliberately
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Check lockout before comparing password
    if (user.isLocked()) {
      return res.status(423).json({
        message:
          "Account temporarily locked due to too many failed attempts. Try again later.",
      });
    }

    // bcrypt comparison — timing-safe
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment failed attempts — may trigger lockout
      await user.incrementFailedAttempts();
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Successful login — reset failed attempts
    await user.resetFailedAttempts();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// POST /api/auth/login/insecure
// SECURITY NOTE: This deliberately vulnerable endpoint
// shows what NOT to do — kept for comparison/learning.
// Specific error messages, no lockout, no bcrypt.
router.post("/login/insecure", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    // VULNERABILITY: Reveals whether username exists
    if (!user) {
      return res.status(401).json({
        message: "Username not found",
      });
    }

    // VULNERABILITY: No lockout check
    // VULNERABILITY: bcrypt compare still used here
    // but in a truly insecure app this would be
    // plaintext comparison: user.password === password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // VULNERABILITY: Reveals password was wrong
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
