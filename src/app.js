require("./db/mongoose");

const express = require("express");
const app = express();

const userController = require("./controllers/user");
const uploadController = require("./controllers/upload");
const authMiddleware = require("./controllers/auth.middleware");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json();
});

app.post("/user", userController.signup);

app.delete("/user/:email", userController._deleteUser);

app.post("/auth", userController.signin);

app.post("/upload", authMiddleware.handle, uploadController.upload);

module.exports = app;
