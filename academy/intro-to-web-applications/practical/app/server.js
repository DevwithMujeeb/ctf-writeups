// ============================================
// WEB APP LAB — EXPRESS SERVER
//
// This is a deliberately annotated backend
// showing both secure patterns and common
// vulnerabilities — for learning purposes only.
// ============================================

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security middleware ---
// SECURITY NOTE: Helmet sets secure HTTP response
// headers automatically. Without it, the server
// leaks information and is vulnerable to clickjacking,
// MIME sniffing, and other header-based attacks.
app.use(helmet());

// SECURITY NOTE: CORS restricts which origins can
// make requests to this API. Using wildcard (*) with
// credentials is a misconfiguration — always specify
// the exact allowed origin in production.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

// --- Body parsing ---
// SECURITY NOTE: Limiting body size prevents
// large payload denial-of-service attacks.
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// --- Rate limiting ---
// SECURITY NOTE: Without rate limiting, login
// endpoints are trivially brute-forced.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter on auth endpoints
  message: { message: "Too many login attempts, please try again later." },
});

app.use("/api/", limiter);
app.use("/api/login", authLimiter);

// --- Static files ---
// Serve the frontend HTML/CSS/JS
app.use(express.static(path.join(__dirname, "../html")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));

// --- Routes ---
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// --- Root route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/index.html"));
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error handler ---
// SECURITY NOTE: Never send stack traces or internal
// error details to the client in production.
// Log them server-side, return generic message externally.
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ message: "Something went wrong." });
  }

  res.status(500).json({
    message: err.message,
    stack: err.stack, // only in development
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
