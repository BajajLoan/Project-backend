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

router.put("/charge-approval",  async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Admin only" });
    // }

    const { applicationId, chargeId, approval } = req.body;
    // approval = 0 or 1

    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const charge = app.charges.id(chargeId);
    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    charge.approval = approval;
    await app.save();

    res.json({
      message: "Charge approval updated",
      charge
    });

  } catch (err) {
    res.status(500).json({ message: "Approval update failed" });
  }
});


module.exports = router;
