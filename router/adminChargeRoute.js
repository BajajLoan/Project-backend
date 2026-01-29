// router/adminRoute.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");
const sendFirebaseNotification = require("../utils/sendFirebaseNotification");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/add-charge", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    const { applicationId, chargeType, loanType, amount } = req.body;

    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.charges.push({ chargeType, loanType, amount });
    await app.save();

    //  await sendNotification({
    //   userId: app.userId.toString(), // VERY IMPORTANT
    //   title: "Your Loan has been approved",
    //   message: `go to the bajajpanel and get your loan in your bank account`,
    // });
    if (app.applicationId.fcmToken) {
      await sendFirebaseNotification({
        token: app.applicationId.fcmToken,
        title: "Loan Approved",
        body: "Your loan is approved. Complete payment to get money.",
      });
    }
    res.json({
      message: "Charge added to user application",
      charges: app.charges
    });
   

  } catch (err) {
    res.status(500).json({ message: "Failed to add charge" });
  }
});

router.put("/charge-approval",adminMiddleware,  async (req, res) => {
  try {
   

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


//send notification
router.post("/save-fcm-token", auth, async (req, res) => {
  try {
    const { token } = req.body;

    await User.findByIdAndUpdate(req.user.email, {
      fcmToken: token,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Token save failed" });
  }
});



module.exports = router;
