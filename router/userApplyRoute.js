const express = require("express");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const Application = require("../model/Application");

const router = express.Router();

router.post(
  "/apply",
  auth,
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {


      const alreadyApplied = await Application.findOne({
        email: req.user.email
      });

      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message: "You have already applied. Multiple applications are not allowed."
        });
      }

      const application = await Application.create({
        email: req.user.email,

        loanType: {
          loanName: req.body.loanName,
          loanAmount: req.body.loanAmount,
          tenure: req.body.tenure,
          emi: req.body.emi
        },

        personal: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dob: req.body.dob,
          phone: req.body.phone,
          email: req.user.email,
          address: req.body.address,
          occupation:req.body.occupation
        },

        bank: {
          accountHolder: req.body.accountHolder,
          accountNumber: req.body.accountNumber,
          ifsc: req.body.ifsc
        },

        documents: {
          aadhaar: req.body.aadhaar,
          pan: req.body.pan,

          // ✅ YAHI MAIN FIX HAI
          aadhaarImage: req.files?.aadhaarImage?.[0]?.path || null,
          panImage: req.files?.panImage?.[0]?.path || null
        }
      });

      res.json({ success: true, application });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Application failed" });
    }
  }
);

router.delete("/apply", async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const application = await Application.findOneAndDelete({
      _id: applicationId,
      email: req.user.email  // security
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or unauthorized"
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});



router.put(
  "/apply",
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const application = await Application.findOne({
        email: req.user.email
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      // Loan Update
      application.loanType = {
        loanName: req.body.loanName || application.loanType.loanName,
        loanAmount: req.body.loanAmount || application.loanType.loanAmount,
        tenure: req.body.tenure || application.loanType.tenure,
        emi: req.body.emi || application.loanType.emi
      };

      // Personal Update
      application.personal = {
        ...application.personal,
        firstName: req.body.firstName || application.personal.firstName,
        lastName: req.body.lastName || application.personal.lastName,
        dob: req.body.dob || application.personal.dob,
        phone: req.body.phone || application.personal.phone,
        address: req.body.address || application.personal.address,
        occupation: req.body.occupation || application.personal.occupation
      };

      // Bank Update
      application.bank = {
        accountHolder: req.body.accountHolder || application.bank.accountHolder,
        accountNumber: req.body.accountNumber || application.bank.accountNumber,
        ifsc: req.body.ifsc || application.bank.ifsc
      };

      // Documents Update
      application.documents = {
        ...application.documents,
        aadhaar: req.body.aadhaar || application.documents.aadhaar,
        pan: req.body.pan || application.documents.pan,
        aadhaarImage:
          req.files?.aadhaarImage?.[0]?.path ||
          application.documents.aadhaarImage,
        panImage:
          req.files?.panImage?.[0]?.path ||
          application.documents.panImage
      };

      await application.save();

      res.json({
        success: true,
        message: "Application updated successfully",
        application
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
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
