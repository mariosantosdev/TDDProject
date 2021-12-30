const UserModel = require("../db/User");

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
}

module.exports = new User();
