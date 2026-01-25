const express = require("express");
const router = express.Router();

const {
  createAdminContact,
  updateAdminContact,
  getAdminContact,
  createAdminPayment,
  updateAdminPayment,
  getAdminPayment
} = require("../controller/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload")

// CONTACT
router.post("/contact", authMiddleware,adminMiddleware, createAdminContact);
router.put("/contact", authMiddleware,adminMiddleware, updateAdminContact);
router.get("/contact", authMiddleware, getAdminContact);

// PAYMENT (QR IMAGE UPLOAD)
router.post(
  "/payment",
  authMiddleware,adminMiddleware,
  upload.fields([
    { name: "qrImage", maxCount: 1 }
  ]),
  createAdminPayment
);

router.put(
  "/payment",
  authMiddleware,adminMiddleware,
  upload.single("qrImage"),
  updateAdminPayment
);

router.get("/payment", authMiddleware, getAdminPayment);
module.exports = router;
