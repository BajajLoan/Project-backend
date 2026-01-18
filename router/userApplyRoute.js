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

module.exports = router;
