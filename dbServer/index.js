const fs = require("fs");

const express = require("express");
const routes = require("./routes.js");
const bodyParser = require("body-parser");
const https = require("https");
const axios = require("axios");

const { PORT } = require("./config/env");
const { dbInit } = require(`./config/Db`);
const { SERVER_CREDENTIALS, TOKEN_NAME } = require("./config/constants");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
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
})();

dbInit().then(() =>
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
);
