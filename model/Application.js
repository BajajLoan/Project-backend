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
  fcmToken: { type: String },
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
      approval: {
        type: Number,
        enum: [0, 1],
        default: 0   // ✅ admin approval pending
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Application", applicationSchema);
