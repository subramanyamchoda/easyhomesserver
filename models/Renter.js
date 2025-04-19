const mongoose = require("mongoose");


const renterSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  role: { type: String, default: "renter" },
  homes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }] ,
  commits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commit' }],

});

const Renter = mongoose.model("Renter", renterSchema);

module.exports = Renter;

