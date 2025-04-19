const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String }, 
  mobile: { type: String },
  role: { type: String, default: "user" },
  commits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commit' }],
  });

module.exports = mongoose.model("User", UserSchema);
