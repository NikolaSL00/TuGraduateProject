const express = require("express");
require("express-async-errors");
const { json } = require("body-parser");

const { errorHandler, NotFoundError } = require("@shopsmart/common");
const recognizeRouter = require("./routes/recognize");
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use("/api/ai", recognizeRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
