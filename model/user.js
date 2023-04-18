const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  user_name: { type: String, default: null },
  email: { type: String, unique: true },
  address: { type: String, default: null },
  password: { type: String },
  token: { type: String },
});

const User = mongoose.model("user", userSchema);
module.exports = User;

