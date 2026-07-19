const mongoose = require("mongoose");

// ============================================
// DATABASE CONNECTION
//
// SECURITY NOTE: The connection string contains
// credentials — always load from environment
// variables, never hardcode in source code.
// A hardcoded connection string committed to
// a public repo gives anyone full database access.
// ============================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
