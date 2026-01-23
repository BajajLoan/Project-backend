const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  changeAdminPassword ,
  getAllApplications
} = require("../controller/adminController");

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.put("/admin/change-password",changeAdminPassword)
router.get("/getdata",getAllApplications)
module.exports = router;
