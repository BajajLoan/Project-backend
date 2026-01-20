const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
require("dotenv").config();
const router = express.Router();

const transporter = nodemailer.createTransport({
   host: "smtp-relay.brevo.com",
  port: 587,       
  secure: false,  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let user = await User.findOne({ email }) || new User({ email });
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
     from: "serviceinvestor.bajaj@gmail.com",
    to: email,
    subject: "Your OTP",
    html: `<h2>${otp}</h2>`
  });

  res.json({ message: "OTP sent" });
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ message: "Invalid OTP" });

  user.otp = null;
  await user.save();

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

module.exports = router;
