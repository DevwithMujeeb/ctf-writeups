const express = require("express");
const router = express.Router();

// GET /api
// Documents all available endpoints.
// SECURITY NOTE: Never expose this in production —
// it gives attackers a complete map of your attack surface.
router.get("/", (req, res) => {
  res.status(200).json({
    name: "Web App Lab API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login":
          "Login — secure (bcrypt, lockout, generic errors)",
        "POST /api/auth/login/insecure":
          "Login — VULNERABLE version for comparison",
        "GET /api/auth/me": "Get current user — requires JWT",
      },
      users: {
        "GET /api/users": "List all users — unauthenticated (IDOR demo)",
        "GET /api/users/:id": "Get user by ID — unauthenticated (IDOR demo)",
      },
      contact: {
        "POST /api/contact": "Submit contact form — saves to database",
      },
      health: {
        "GET /api/health": "Server health check",
      },
    },
    securityNotes: {
      "auth/login/insecure": "Username enumeration, no lockout, no bcrypt",
      "users + users/:id": "No authentication — IDOR vulnerability demo",
    },
  });
});

// GET /api/health
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "connected",
  });
});

module.exports = router;
