// router/userChargeRoute.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");
const upload = require("../middleware/upload");

const router = express.Router();

router.put(
  "/user/payment",
  auth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { applicationId, chargeId } = req.body;

      const image = req.files?.image
        ? req.files.image[0].path
        : null;

      const app = await Application.findById(applicationId);
      if (!app) {
        return res.status(404).json({ message: "Application not found" });
      }

      const charge = app.charges.id(chargeId);
      if (!charge) {
        return res.status(404).json({ message: "Charge not found" });
      }

      // ✅ VALIDATION: same charge me dobara upload nahi
      if (charge.image) {
        return res.status(400).json({
          message:
            "Payment proof already uploaded for this charge. Please pay for a new charge."
        });
      }

      charge.image = image;
      await app.save();

      res.json({ message: "Charges Paid Successfully" });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
