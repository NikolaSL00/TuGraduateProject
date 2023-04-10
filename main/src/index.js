const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const routes = require("./routes.js");
const cookieParser = require("cookie-parser");

const { auth } = require("./middlewares/authMiddleware");
const { PORT } = require("./config/env");

const app = express();

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(auth);
app.use(routes);

http.createServer(app).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
