const UserModel = require("../db/User");

class User {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = new UserModel({ name, email, password });

      await user.save();

      res.status(201).json(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new User();
