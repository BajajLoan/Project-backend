const express = require("express");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const Application = require("../model/Application");

const router = express.Router();

// APPLY (WITH AADHAAR + PAN IMAGE)
router.post(
  "/apply",
  auth,
  upload.fields([
    { name: "aadhaarImageFile", maxCount: 1 },
    { name: "pan", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const application = await Application.create({
        email: req.user.email,

        loanType: {loanName:req.body.loanName,
          loanAmount:req.body.loanAmount,
          tenure:req.body.tenure,
          emi:req.body.emi
        }, // "personal"

        personal: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dob: req.body.dob,
          phone: req.body.phone,
          email: req.body.email,
          address: req.body.address
        },

        bank: {
          accountHolder: req.body.accountHolder,
          accountNumber: req.body.accountNumber,
          ifsc: req.body.ifsc
        },

        documents: {
          aadhaar: req.body.aadhaar,
          pan: req.body.pan,
          aadhaarImage: req.files?.aadhaarImageFile?.[0]?.filename || null,
          panImage: req.files?.pan?.[0]?.filename || null
        }
      });

      res.json({ success: true, application });
    } catch (err) {
      res.status(500).json({ message: "Application failed" });
    }
  }
);


// GET LOGGED-IN USER APPLICATION
router.get("/user-detail", auth, async (req, res) => {
  try {
    const applications = await Application.find({
      email: req.user.email
    });

    if (!applications.length) {
      return res.status(404).json({ message: "No application found" });
    }

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pending-charges", async (req, res) => {
  try {
    const email = req.query.email;

    const count = await Application.countDocuments({
      email,
      "charges.approval": 0
    });

    res.json({ hasPending: count > 0 });
  } catch (err) {
    res.status(500).json({ hasPending: false });
  }
});

module.exports = router;
