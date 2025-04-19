const Renter = require("../models/Renter");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const secretKey = process.env.JWT_SECRET;
const verifiTokens = async (req, res, next) => {
    try {
      const token = req.headers.token;
  
      if (!token) {
        return res.status(401).json({ message: "Token required" });
      }
  
      const decoded = jwt.verify(token, secretKey);
      const renter = await Renter.findById(decoded.renterId);
  
      if (!renter) {
        return res.status(404).json({ message: "Renter not found" });
      }
  
      req.renterId = renter._id;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
  
  module.exports ={verifiTokens} ;