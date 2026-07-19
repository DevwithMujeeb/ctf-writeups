const express = require("express");
const router = express.Router();

// Demo credentials — Step 6 replaces with DB lookup
// SECURITY NOTE: Never hardcode credentials in source
// code. This is here purely for demonstration.
// In production, credentials are stored as bcrypt
// hashes in the database — never plaintext.
const DEMO_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "member" },
];

// POST /api/auth/login
// SECURITY NOTE: This is a deliberately insecure
// implementation showing what NOT to do:
// - Plaintext password comparison (no bcrypt)
// - No account lockout after failed attempts
// - Specific error messages revealing whether
//   the username or password was wrong (enumeration)
// Step 6 will replace this with the secure version.
router.post("/login/insecure", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = DEMO_USERS.find((u) => u.username === username);

  // VULNERABILITY: Reveals whether username exists
  if (!user) {
    return res.status(401).json({ message: "Username not found" });
  }

  // VULNERABILITY: Plaintext password comparison
  if (user.password !== password) {
    return res.status(401).json({ message: "Wrong password" });
  }

  res.status(200).json({
    message: "Login successful",
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// POST /api/auth/login
// SECURITY NOTE: This is the SECURE version —
// generic error message, bcrypt comparison (Step 6),
// account lockout (Step 6), rate limiting applied
// at the server level via express-rate-limit.
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = DEMO_USERS.find((u) => u.username === username);

  // Generic message — does not reveal whether
  // username or password was wrong
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.status(200).json({
    message: "Login successful",
    user: { id: user.id, username: user.username, role: user.role },
  });
});

module.exports = router;
