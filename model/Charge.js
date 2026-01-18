const mongoose = require("mongoose");

const chargeSchema = new mongoose.Schema({
  chargeType: String,
  loanType: {
    type: String,
    enum: ["personal", "business", "home", "education"]
  },
  amount: Number
}, { timestamps: true });

module.exports = mongoose.model("Charge", chargeSchema);
