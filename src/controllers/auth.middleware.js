const UserModel = require("../db/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsakdjaisjdasmdkamdkasnuyhe127y3y217kdm3u1";

class AuthMidleware {
  async handle(req, res, next) {
    try {
      const rawToken = req.headers.authorization;

      if (!rawToken || rawToken === "") {
        return res.status(403).json({ messageError: "Token is missing." });
      }

      const token = rawToken.replace("Bearer ", "");
      const { id } = jwt.verify(token, JWT_SECRET);

      const existUser = await UserModel.findById(id);

      if (!existUser) {
        return res.status(403).json({ messageError: "Token is invalid." });
      }

      req.userId = id;
      next();
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new AuthMidleware();
