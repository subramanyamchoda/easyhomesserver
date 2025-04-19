const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Renter
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Renter' }, // Property Owner
  homeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Home' },
  screenshot: { type: String }, // Path to image
  status: { type: String, default: "Pending" },
  accepted: {
    type: Boolean,
    default: false
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Commit", commitSchema);
