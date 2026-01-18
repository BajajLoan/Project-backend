const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../model/Application");

const router = express.Router();

// APPLY
router.post("/apply", auth, async (req, res) => {
  const app = await Application.create({
    email: req.user.email,
    ...req.body
  });
  res.json(app);
});

// UPLOAD IMAGE
// router.post("/charge/upload-image", auth, async (req, res) => {
//   const { applicationId, chargeId, image } = req.body;

//   const app = await Application.findById(applicationId);
//   const charge = app.charges.find(c => c.chargeId == chargeId);

//   charge.image = image;
//   await app.save();

//   res.json({ message: "Image uploaded" });
// });

module.exports = router;
