const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/tddimg", { useNewUrlParser: true })
  .then(() => console.log("Connected in database"))
  .catch((error) => console.error(error));
