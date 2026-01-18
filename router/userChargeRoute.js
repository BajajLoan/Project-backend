// router/userChargeRoute.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");

const router = express.Router();

router.post("/user/charge/upload-image", auth, async (req, res) => {
  try {
    const { applicationId, chargeId, image } = req.body;

    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const charge = app.charges.id(chargeId);
    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    if (charge.image) {
      return res.status(400).json({ message: "Image already uploaded" });
    }

    charge.image = image;
    await app.save();

    res.json({ message: "Image uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
