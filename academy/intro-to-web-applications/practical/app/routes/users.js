const express = require("express");
const router = express.Router();

// SECURITY NOTE: This endpoint is intentionally
// simple for demonstration. In a real app:
// - Require authentication before returning user data
// - Never return password hashes in responses
// - Paginate results — never return unbounded lists
// - Filter fields explicitly rather than returning
//   the full database document

// Hardcoded demo data — Step 6 will replace this
// with real database queries
const demoUsers = [
  {
    id: 1,
    name: "Alice Admin",
    email: "alice@example.com",
    role: "admin",
    // password hash intentionally excluded from response
  },
  {
    id: 2,
    name: "Bob User",
    email: "bob@example.com",
    role: "member",
  },
];

// GET /api/users
// SECURITY NOTE: No authentication required here —
// this is intentional for demo purposes to show
// what an unauthenticated API endpoint looks like.
// In production this would require a valid JWT.
router.get("/", (req, res) => {
  res.status(200).json({
    count: demoUsers.length,
    users: demoUsers,
  });
});

// GET /api/users/:id
// SECURITY NOTE: The :id parameter is user-controlled.
// Without proper validation, this is an IDOR
// (Insecure Direct Object Reference) vulnerability —
// changing the ID in the URL accesses any user's data.
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = demoUsers.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
});

module.exports = router;
