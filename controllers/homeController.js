const fs = require("fs");
const multer = require("multer");
const Home = require("../models/Home");
const Renter = require('../models/Renter');

// Ensure "uploads" directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
}).array("images", 5);

const homeSender = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { title, name, mobile, street, town, district, pincode, state, pluscode, rentprice } = req.body;

      if (!title || !name || !mobile || !street || !town || !district || !pincode || !pluscode || !rentprice) {
        return res.status(400).json({ error: "All required fields must be filled" });
      }

      console.log("User ID from request:", req.renterId);
      
      const renter = await Renter.findById(req.renterId);
      console.log("Renter found:", renter);

      if (!renter) {
        return res.status(404).json({ error: "Renter not found" });
      }

      const imageFilenames = req.files?.map((file) => file.filename) || [];
      if (imageFilenames.length === 0) {
        return res.status(400).json({ error: "At least one image is required!" });
      }

      // Create new home listing
      const newHome = new Home({ 
        title, name, mobile, street, town, district, pincode, state, pluscode, rentprice, 
        images: imageFilenames, renter: renter._id  
      });

      await newHome.save();
      renter.homes.push(newHome._id);
      await renter.save();

      res.status(201).json({ message: "Home listing added successfully", home: newHome });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

const getHomes = async (req, res) => {
  try {
    const homes = await Home.find().populate("renter");
    res.status(200).json(homes);
  } catch (error) {
    console.error("Error fetching homes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteHome = async (req, res) => {
  const { id } = req.params;
  try {
    const home = await Home.findById(id);
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }
    await Renter.findByIdAndUpdate(home.user, { $pull: { homes: home._id } });
    await Home.findByIdAndDelete(id);
   res.status(200).json({ message: "Home deleted successfully" });
  } catch (error) {
    console.error("Error deleting home:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { homeSender, getHomes, deleteHome };
