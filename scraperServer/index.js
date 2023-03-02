const fs = require("fs");

const express = require("express");
const https = require("https");
const axios = require("axios");

const { PORT } = require("./config/env");
const { SERVER_CREDENTIALS, TOKEN_NAME } = require("./config/constants");
const { scheduler } = require("./scheduler/scheduler");

const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

const options = {
  key: fs.readFileSync("./httpsCert/key.pem"),
  cert: fs.readFileSync("./httpsCert/cert.pem"),
};
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  scheduler();
});
