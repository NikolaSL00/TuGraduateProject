const express = require("express");
const { PORT } = require("./config/env");
const { dbInit } = require(`./config/Db`);
const routes = require("./routes.js");
// const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const { auth } = require("./middlewares/authMiddleware");
// const cors = require("cors");
//const { errorHandler } = require("./middlewares/errorHandlerMiddleware");

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
  app.listen(PORT, () => console.log(`App is listnening on Port ${PORT}...`))
);
