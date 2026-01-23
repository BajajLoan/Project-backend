const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminProfile = require("../model/AdminProfile")
const Application = require("../model/Application")
/**
 * REGISTER ADMIN
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: "admin"
    });

    res.json({
      message: "Admin registered successfully",
      adminId: admin._id
    });

  } catch (err) {
    res.status(500).json({ message: "Admin registration failed" });
  }
};

/**
 * LOGIN ADMIN
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Admin login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};


/**
 * CHANGE ADMIN PASSWORD
 */
exports.changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({
      message: "Password changed successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Change password failed" });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error("Get Applications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });
  }
};




/**
 * CREATE ADMIN PROFILE (ONLY ONCE)
 */
exports.createAdminProfile = async (req, res) => {
  try {
    const { contactNumber, whatsappNumber, email, image, description } = req.body;

    if (!contactNumber || !whatsappNumber || !email) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // check already exists
    const existingProfile = await AdminProfile.findOne({
      adminId: req.user.id
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Admin profile already exists"
      });
    }

    const profile = await AdminProfile.create({
      adminId: req.user.id,
      contactNumber,
      whatsappNumber,
      email,
      image,
      description
    });

    res.status(201).json({
      message: "Admin profile created successfully",
      profile
    });

  } catch (err) {
    res.status(500).json({ message: "Profile creation failed" });
  }
};


/**
 * CREATE or UPDATE ADMIN PROFILE
 */
/**
 * UPDATE ADMIN PROFILE
 */
exports.updateAdminProfile = async (req, res) => {
  try {
    const profile = await AdminProfile.findOneAndUpdate(
      { adminId: req.user.id },
      req.body,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      profile
    });

  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

/**
 * GET ADMIN PROFILE
 */
exports.getAdminProfile = async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({ adminId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
