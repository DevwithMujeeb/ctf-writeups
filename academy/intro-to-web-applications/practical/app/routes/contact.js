const express = require("express");
const router = express.Router();

// POST /api/contact
// SECURITY NOTE: Every field must be validated
// and sanitized on the server — never trust
// client-side validation alone. An attacker
// can bypass the browser entirely using curl
// or Burp Suite and send any data they want.
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  // Server-side validation — independent of
  // the client-side validation in main.js
  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, email, and message are required",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      message: "Invalid email address",
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      message: "Name cannot exceed 100 characters",
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      message: "Message cannot exceed 1000 characters",
    });
  }

  // SECURITY NOTE: In a real app, this is where
  // you would sanitize against XSS before storing,
  // and send an email or store to database.
  // Never reflect user input directly back in
  // the response without sanitizing first.
  console.log("Contact form submission:", { name, email, message });

  res.status(200).json({
    message: "Message received. We will get back to you shortly.",
  });
});

module.exports = router;
