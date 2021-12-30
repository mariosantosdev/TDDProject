const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/tddimg", { useNewUrlParser: true })
  .then(() => {})
  .catch((error) => console.error(error));
