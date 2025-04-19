const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const path = require("path");
const fs = require("fs");
const mime = require("mime"); 
const mongoose = require("mongoose");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      // Extract necessary fields from the Google payload
      const { sub, email, name, picture } = ticket.getPayload();  // phone_number may or may not be available
      
      // Log the received payload for debugging purposes
      console.log("Google login payload:", ticket.getPayload());
  
      // Fetch the user by their Google ID
      let user = await User.findOne({ googleId: sub });
  
      if (!user) {
        // Create a new user if they do not exist in the database
        user = await User.create({
          googleId: sub,
          email,
          name,
          avatar: picture
        });
      } else {
        // Update avatar in case the user changed their Google profile picture
        user.avatar = picture;
        await user.save();
      }
  
      console.log("User after login:", user); // ✅ Debugging
  
      // Generate a JWT token
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      // Set the JWT token in a cookie for authentication
      res.cookie("authToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Lax",
      });
  
      // Respond with success and the user data
      res.json({ message: "Login successful", user });
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(401).json({ error: "Invalid Google token" });
    }
  };
  
  
  const logout = (req, res) => {
    // Clear the authToken cookie to log the user out
    res.clearCookie("authToken", { 
      path: "/", 
      httpOnly: true, 
      sameSite: "None", 
      secure: true 
    });
    
    res.status(200).json({ message: "Logged out successfully" });
  };
  

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v");
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Fetched User:", user); // ✅ Debugging

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save image path (relative URL)
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Avatar updated successfully", avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// controllers/userController.js
const updateMobile = async (req, res) => {
    const { mobile } = req.body;
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      user.mobile = mobile;
      await user.save();
  
      res.json({ message: "Mobile number updated successfully" });
    } catch (error) {
      console.error("Mobile update error:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  



module.exports = { googleLogin, logout, getUser, uploadAvatar ,updateMobile};

