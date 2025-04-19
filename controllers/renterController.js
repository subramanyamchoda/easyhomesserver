const Renter = require("../models/Renter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;




const registerRenter = async (req, res) => {
  try {
    const { firstname, lastname, email, password, mobile } = req.body;

    // Validate input
    if (!firstname || !lastname || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long!" });
    }

    // Check for existing renter
    const existingRenter = await Renter.findOne({ email });
    if (existingRenter) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new renter
    const newRenter = new Renter({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      mobile
    });

    await newRenter.save();

    return res.status(201).json({ message: "Renter registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// Login Renter
const loginRenter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const renter = await Renter.findOne({ email });
    if (!renter) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const isPasswordValid = await bcrypt.compare(password, renter.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const securityToken = jwt.sign({ renterId: renter._id }, secretKey, { expiresIn: "1h" });
    return res.status(200).json({
      message: "Login successful",
      securityToken,
      renterId: renter._id
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Renter Data by ID
const getRenterData = async (req, res) => {
  try {
    const renterId = req.params.id;

    const renter = await Renter.findById(renterId)
      .populate("homes")
      .populate({
        path: "commits",
        populate: {
          path: "userId", // Assuming this is the user field in the commit schema
          select: "name email", // Add any fields you want to show
        },
      });

    if (!renter) {
      return res.status(404).json({ message: "Renter not found!" });
    }

    res.status(200).json({ renter });
  } catch (error) {
    console.error("Error fetching renter data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const allRenters= async (req, res) => {
  try {
    const renter = await Renter.find().populate("homes");
    res.status(200).json(renter);
  } catch (error) {
    console.error("Error fetching homes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerRenter,
  loginRenter,
  getRenterData,
  allRenters
};
