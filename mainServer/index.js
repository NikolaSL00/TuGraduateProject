const fs = require("fs");

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const routes = require("./routes.js");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const { auth } = require("./middlewares/authMiddleware");
const { PORT } = require("./config/env");
const { SERVER_CREDENTIALS, TOKEN_NAME } = require("./config/constants");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const options = {
  key: fs.readFileSync("./httpsCert/key.pem"),
  cert: fs.readFileSync("./httpsCert/cert.pem"),
};
// const cors = require("cors");
//const { errorHandler } = require("./middlewares/errorHandlerMiddleware");

const app = express();

// app.use(
//   express.urlencoded({
//     extended: false,
//   })
// );
// app.use("/static", express.static("public"));

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// app.use(cors());
app.use(bodyParser.json());
app.use(auth);
app.use(routes);

(() => {
  const options = {
    serverName: SERVER_CREDENTIALS.SERVER_NAME,
    password: SERVER_CREDENTIALS.SERVER_PASSWORD,
  };

  axios
    .post("https://localhost:3000/server/login", options)
    .then((res) => {
      SERVER_CREDENTIALS.TOKEN_VALUE = res.data[TOKEN_NAME];
    })
    .catch((err) => console.log(err));

  // axios
  //   .post("https://localhost:3000/server/register", options)
  //   .then((res) => {
  //     SERVER_CREDENTIALS.TOKEN_VALUE = res.data[TOKEN_NAME];
  //   })
  //   .catch((err) => console.log(err));
})();
//app.get("/", (req, res) => res.send("<h1>Hi</h1"));
// // app.use(errorHandler);

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
