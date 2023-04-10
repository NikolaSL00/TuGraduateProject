const express = require("express");
const http = require("http");

const { PORT } = require("./config/env");
const { scheduler } = require("./scheduler/scheduler");
//const ebag = require("./scheduler/jobs/ebag/ebag");
const app = express();

http.createServer(app).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  scheduler();
});
