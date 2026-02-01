// router/adminRoute.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");
const User = require("../model/User")
const sendFirebaseNotification = require("../utils/sendFirebaseNotification");
const adminMiddleware = require("../middleware/adminMiddleware");
require("dotenv").config();
const nodemailer = require("nodemailer");
const router = express.Router();


const transporter = nodemailer.createTransport({
   host: "smtp-relay.brevo.com",
  port: 587,       
  secure: false,  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});



router.post("/add-charge", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    const {
      applicationId,
      chargeType,
      amount,
      loanName 
    } = req.body;

    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ charge push
    app.charges.push({
      chargeType,
      loanType: loanName,
      amount
    });

    await app.save();

    // ================= EMAIL DATA =================
    const userEmail = app.email;
    const userName = app.personal?.name || "Customer";

    const loanAmount = app.loanType.loanAmount;
    const interestRate = "5%";
    const emi = app.emi || "Calculated Soon";

    const paymentLink = `https://yourdomain.com/payment/${app._id}`;

    // ================= EMAIL HTML =================
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#2c3e50;">Loan Approved 🎉</h2>

        <p>Dear <strong>${userName}</strong>,</p>

        <p>Your <strong>${loanName}</strong> loan has been approved. Below are the details:</p>

        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td><strong>Loan Amount</strong></td>
            <td>₹${loanAmount}</td>
          </tr>
          <tr>
            <td><strong>Interest Rate</strong></td>
            <td>${interestRate}</td>
          </tr>
          <tr>
            <td><strong>Monthly EMI</strong></td>
            <td>₹${emi}</td>
          </tr>
          <tr>
            <td><strong>Charge Type</strong></td>
            <td>${chargeType}</td>
          </tr>
          <tr>
            <td><strong>Charge Amount</strong></td>
            <td>₹${amount}</td>
          </tr>
        </table>

        <p style="margin-top:20px;">
          Please complete your payment to proceed further.
        </p>

        <a href="${paymentLink}"
           style="display:inline-block;padding:12px 20px;
                  background:#27ae60;color:#fff;
                  text-decoration:none;border-radius:5px;">
          Complete Payment
        </a>

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>Bajaj Loan Services</strong>
        </p>
      </div>
    `;

    // ================= SEND EMAIL =================
    await transporter.sendMail({
      from: "serviceinvestor.bajaj@gmail.com",
      to: userEmail,
      subject: "Loan Approved – Complete Your Payment",
      html: emailHtml
    });

    // ================= PUSH NOTIFICATION =================
    if (app.fcmToken) {
      await sendFirebaseNotification({
        token: app.fcmToken,
        title: "Loan Approved",
        body: "Your loan is approved. Please complete payment."
      });
    }

    res.json({
      message: "Charge added & notification sent",
      charges: app.charges
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add charge" });
  }
});


router.put("/charge-approval",auth,  async (req, res) => {
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
router.post("/save-fcm-token", async (req, res) => {
  try {
    const { token } = req.body;

    await Application.findByIdAndUpdate(req.user.email, {
      fcmToken: token,
    });
    await User.findByIdAndUpdate(req.user.email, {
      fcmToken: token,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Token save failed" });
  }
});

router.get("/get-fcm-token", async (req, res) => {
  try {
    const email = req.user.email;

    const user = await User.findOne(
      { email },
      { fcmToken: 1, _id: 0 } // sirf fcmToken
    );

    if (!user || !user.fcmToken) {
      return res.status(404).json({
        message: "FCM token not found"
      });
    }

    res.json({
      fcmToken: user.fcmToken
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get FCM token"
    });
  }
});

router.get("/get-fcm", async (req, res) => {
  try {
    const email = req.user.email;

    let record = await Application.findOne(
      { email },
      { fcmToken: 1, _id: 0 }
    );

    if (!record?.fcmToken) {
      record = await User.findOne(
        { email },
        { fcmToken: 1, _id: 0 }
      );
    }

    if (!record?.fcmToken) {
      return res.status(404).json({ message: "FCM token not found" });
    }

    res.json({ fcmToken: record.fcmToken });
  } catch (err) {
    res.status(500).json({ message: "Failed to get FCM token" });
  }
});





module.exports = router;
