const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },  
  mobile: { type: String, required: true },
  street: { type: String, required: true },
  town: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: String, required: true },
  pluscode: { type: String, required: true },
  rentprice: { type: String, required: true },
  images: [{ type: String, required: true }],
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "Renter", required: true },
  commits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commit' }],

});

const Home = mongoose.model("Home", homeSchema);
module.exports = Home;
