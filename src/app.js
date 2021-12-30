require("./db/mongoose");

const express = require("express");
const app = express();

const userController = require("./controllers/user");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json();
});

app.post("/user", userController.signup);

module.exports = app;
