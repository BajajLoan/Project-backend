const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model("User", userSchema);
