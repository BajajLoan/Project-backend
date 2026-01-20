const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  whatsappNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String // image URL or filename
  },
  upiId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("AdminProfile", adminProfileSchema);
