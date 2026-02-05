const mongoose = require("mongoose");

const chargeSchema = new mongoose.Schema({
  chargeType: String,
  refund: Number,
  amount: Number
}, { timestamps: true });

module.exports = mongoose.model("Charge", chargeSchema);
