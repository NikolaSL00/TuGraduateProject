const fs = require('fs');

const express = require('express');
require('express-async-errors');
const https = require('https');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const cookieParser = require('cookie-parser');

const { dbInit } = require(`./config/Db`);
const { auth } = require('./middlewares/authMiddleware');
const { PORT } = require('./config/env');

const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/errorMiddleware');

const options = {
  key: fs.readFileSync('./httpsCert/key.pem'),
  cert: fs.readFileSync('./httpsCert/cert.pem'),
};

const app = express();

app.get('/', (req, res) => {
  console.log(req.socket.remoteAddress);
});

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(auth);
app.use(routes);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

dbInit().then(() =>
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
);
