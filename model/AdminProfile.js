const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      unique: true,
    },

    /* =======================
       CONTACT DETAILS
    ======================= */
    contactNumber: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    /* =======================
       PAYMENT DETAILS
    ======================= */
    upiId: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    ifsc: {
      type: String,
      default: "",
    },
    accountHolder: {
      type: String,
      default: "",
    },

    qrImage: {
      type: String, // image path / url
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminProfile", adminProfileSchema);
