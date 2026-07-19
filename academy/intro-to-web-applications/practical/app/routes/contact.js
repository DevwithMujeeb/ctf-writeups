const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// POST /api/contact
// Now saves to MongoDB instead of just logging
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

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

    await Message.create({ name, email, message });

    res.status(200).json({
      message: "Message received. We will get back to you shortly.",
    });
  } catch (err) {
    console.error("Contact form error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
