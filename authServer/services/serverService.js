const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/env");

const Server = require("../models/Server");

exports.login = async (serverName, password) => {
  const server = await Server.findOne({
    serverName,
  });

  if (!server) {
    throw {
      message: `Not valid serverName!`,
    };
  }

  const isValid = await bcrypt.compare(password, server.password);

  if (!isValid) {
    throw {
      message: `Wrong password!`,
    };
  }

  return server;
};

exports.create = async (serverData) => {
  const { serverName, password } = serverData;

  const serverNameCheck = await Server.findOne({ serverName: serverName });

  if (serverNameCheck) {
    throw {
      message: `Server with that name already exists!`,
    };
  }

  return Server.create(serverData);
};

exports.createServerToken = (server) => {
  const payload = {
    serverName: server.serverName,
  };

  const options = {};

  const tokenPromise = new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }

      resolve(decodedToken);
    });
  });

  return tokenPromise;
};
