const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: "Name is required" },
  email: { type: String, required: "email is required" },
  password: { type: String, required: "password is required" },
});
module.exports = mongoose.model("User", userSchema);
