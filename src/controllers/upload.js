const UserModel = require("../db/User");
const jwt = require("jsonwebtoken");

class UploadController {
  async upload(req, res) {
    res.status(200).send();
  }
}

module.exports = new UploadController();
