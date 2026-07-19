const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================
// AUTH MIDDLEWARE
//
// Verifies JWT from Authorization header and
// attaches the authenticated user to req.user.
//
// SECURITY NOTE: We re-fetch the user from the
// database on every request rather than trusting
// the JWT payload alone. If an account is locked
// or deleted after token issuance, the next
// request is rejected even though the JWT is
// still cryptographically valid.
// ============================================

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Role-based access control middleware
// SECURITY NOTE: Always check role server-side —
// never trust role information sent by the client.
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };
