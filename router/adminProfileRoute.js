const express = require("express");
const router = express.Router();

const {
  createAdminProfile,
  updateAdminProfile,
  getAdminProfile
} = require("../controller/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/profile",
  authMiddleware,
  adminMiddleware,
  createAdminProfile
);

router.put(
  "/profile",
  authMiddleware,
  adminMiddleware,
  updateAdminProfile
);

router.get(
  "/profile",
  authMiddleware,
  adminMiddleware,
  getAdminProfile
);

module.exports = router;
