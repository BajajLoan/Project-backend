// router/userChargeRoute.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");
const upload = require("../middleware/upload");

const router = express.Router();

router.put("/user/payment", auth, upload.fields([
    { name: "paymentImage", maxCount: 1 }
  ]), async (req, res) => {
  try {
    const { applicationId, chargeId } = req.body;
    const paymentImage = req.files?.paymentImage
      ? req.files.paymentImage[0].path
      : null;
    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const charge = app.charges.id(chargeId);
    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    if (charge.paymentImage) {
      return res.status(400).json({ message: "Image already uploaded" });
    }

    charge.paymentImage = paymentImage;
    await app.save();

    res.json({ message: "Image uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
