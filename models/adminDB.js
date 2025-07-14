// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true },
  sessionCookie: { type: String  , unique:true},
  refreshToken: { type: String }, // 🔐 Refresh token field
});


module.exports = mongoose.model("AdminDB", adminSchema);
