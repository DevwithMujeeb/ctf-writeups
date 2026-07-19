const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ============================================
// USER MODEL
//
// This model demonstrates secure data storage
// patterns — password hashing, field selection,
// role enumeration, and brute-force tracking.
// ============================================

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      // SECURITY NOTE: select: false means this field
      // is excluded from all queries by default.
      // You must explicitly add .select('+password')
      // to get it — prevents accidental exposure.
      select: false,
    },
    role: {
      type: String,
      // SECURITY NOTE: Fixed enum prevents mass
      // assignment attacks setting arbitrary roles.
      enum: {
        values: ["admin", "member"],
        message: "{VALUE} is not a valid role",
      },
      default: "member",
    },
    // Brute-force protection fields
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Hash password before saving
// SECURITY NOTE: Only hash if password was modified —
// otherwise every save operation would re-hash the
// already-hashed value, breaking authentication.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare plaintext password against stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is currently locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment failed attempts — lock after 5
userSchema.methods.incrementFailedAttempts = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }
  await this.save();
};

// Reset on successful login
userSchema.methods.resetFailedAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

module.exports = mongoose.model("User", userSchema);
