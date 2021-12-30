const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserModel = mongoose.model("User", user);

module.exports = UserModel;
