// router/adminRoute.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");

const router = express.Router();

router.post("/add-charge", auth, async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Admin access denied" });
    // }

    const { applicationId, chargeType, loanType, amount } = req.body;

    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.charges.push({ chargeType, loanType, amount });
    await app.save();

    res.json({
      message: "Charge added to user application",
      charges: app.charges
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add charge" });
  }
});

module.exports = router;
