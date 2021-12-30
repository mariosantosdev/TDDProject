require("./db/mongoose");

const express = require("express");
const multer = require("multer");

const userController = require("./controllers/user");
const uploadController = require("./controllers/upload");
const authMiddleware = require("./controllers/auth.middleware");

const storage = multer.memoryStorage();

const app = express();
const upload = multer({ storage });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/uploads", express.static(__dirname + "/../uploads"));

app.get("/", (req, res) => {
  res.json();
});

app.post("/user", userController.signup);

app.delete("/user/:email", userController._deleteUser);

app.post("/auth", userController.signin);

app.post(
  "/upload",
  authMiddleware.handle,
  upload.single("file"),
  uploadController.upload
);

module.exports = app;
