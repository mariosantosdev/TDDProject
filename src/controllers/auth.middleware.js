const UserModel = require("../db/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsakdjaisjdasmdkamdkasnuyhe127y3y217kdm3u1";

class AuthMidleware {
  handle(req, res, next) {
    try {
      const rawToken = req.headers.authorization;

      if (!rawToken || rawToken === "") {
        return res.status(403).json({ messageError: "Token is missing." });
      }

      const token = rawToken.replace("Bearer ", "");
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (err.message === "invalid token")
            return res.status(403).json({ messageError: "Token is invalid." });
          console.log(err);
          return res.status(403).send(err);
        }

        const existUser = await UserModel.findById(decoded.id);

        if (!existUser) {
          return res.status(403).json({ messageError: "Token is invalid." });
        }

        req.userId = decoded.id;
        next();
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

module.exports = new AuthMidleware();
