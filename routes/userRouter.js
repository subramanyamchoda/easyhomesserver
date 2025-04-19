const express = require("express");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const multer = require("multer");

const { googleLogin, logout, getUser, uploadAvatar,updateMobile } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage }); // ✅ Define upload

// Routes
router.post("/login", googleLogin);
router.post("/logout", logout);
router.get("/users", authenticateUser, getUser);
router.post("/upload-avatar", authenticateUser, upload.single("avatar"), uploadAvatar);
// routes/userRoutes.js
router.post("/update-mobile", updateMobile);

module.exports = router;
