const mongoose = require("mongoose");

const upload = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  link: String,
});

const UploadModel = mongoose.model("Upload", upload);

module.exports = UploadModel;
