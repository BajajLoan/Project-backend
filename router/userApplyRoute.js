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
    { name: "aadhaar", maxCount: 1 },
    { name: "pan", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const app = await Application.create({
        email: req.user.email,
        ...req.body,

        documents: {
          ...req.body.documents,
          aadhaarImage: req.files?.aadhaar?.[0]?.filename || null,
          panImage: req.files?.pan?.[0]?.filename || null
        }
      });

      res.json({sucess:true,app,message:"Application has been submitted."});
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

module.exports = router;
