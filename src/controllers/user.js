const UserModel = require("../db/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsakdjaisjdasmdkamdkasnuyhe127y3y217kdm3u1";

class User {
  async signup(req, res) {
    try {
      if (!req.body.name || req.body.name === "") {
        return res
          .status(400)
          .json({ messageError: 'Field "Name" is missing.' });
      }

      if (!req.body.email || req.body.email === "") {
        return res
          .status(400)
          .json({ messageError: 'Field "Email" is missing.' });
      }

      if (!req.body.password || req.body.password === "") {
        return res
          .status(400)
          .json({ messageError: 'Field "Password" is missing.' });
      }

      const { name, email, password } = req.body;

      const hasExistUserWithEmail = await UserModel.findOne({ email });
      if (hasExistUserWithEmail) {
        return res
          .status(400)
          .json({ messageError: "Already exist user with it email." });
      }

      const user = new UserModel({ name, email, password });

      await user.save();

      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "48h" });

      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async _deleteUser(req, res) {
    try {
      const email = req.params.email;

      await UserModel.deleteOne({ email });

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

module.exports = new User();
