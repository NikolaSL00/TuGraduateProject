const express = require("express");
const routes = require("./routes.js");
const bodyParser = require("body-parser");
const http = require("http");

const { PORT } = require("./config/env");
const { dbInit } = require(`./config/Db`);

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(routes);

app.post("/", (req, res) => {
  console.log(req.body.data.result);
});

dbInit().then(() =>
  http.createServer(app).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
);
