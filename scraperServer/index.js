const fs = require("fs");

const express = require("express");
const routes = require("./routes.js");
const bodyParser = require("body-parser");
const https = require("https");

const { PORT } = require("./config/env");
const { dbInit } = require(`./config/Db`);
// const cookieParser = require("cookie-parser");
// const { auth } = require("./middlewares/authMiddleware");
// const cors = require("cors");
//const { errorHandler } = require("./middlewares/errorHandlerMiddleware");

const options = {
  key: fs.readFileSync("./httpsCert/key.pem"),
  cert: fs.readFileSync("./httpsCert/cert.pem"),
};

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);
// app.use("/static", express.static("public"));

// app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// // app.use(cors());
app.use(bodyParser.json());
// app.use(auth);
app.use(routes);
// // // app.use(errorHandler);

dbInit().then(() =>
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
);
