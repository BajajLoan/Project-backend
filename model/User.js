const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fcmToken: { type: String },
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model("User", userSchema);
