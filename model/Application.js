// model/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  email: String,
  loanType: {
    loanName: String,
    loanAmount: Number,
    tenure: Number
  },

  personal: Object,
  bank: Object,
  documents: Object,

  charges: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true   // ✅ unique charge id auto
      },
      chargeType: String,
      loanType: String,
      amount: Number,
      image: {
        type: String,
        default: null
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Application", applicationSchema);
