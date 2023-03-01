const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/env");
const addressService = require("./addressService");

exports.create = async (userData) => {
  const { email, addressData } = userData;

  const emailCheck = await User.findOne({ email: email });
  if (emailCheck) {
    throw {
      message: `User with that email already exists!`,
    };
  }

  const address = await addressService.create(addressData);
  return User.create({ ...userData, address: address._id });
};

exports.login = async (email, password) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw {
      message: `Wrong email or password!`,
    };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw {
      message: `Wrong email or password!`,
    };
  }

  return user;
};

exports.createUserToken = (user) => {
  const payload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
  };

  const options = {
    expiresIn: "3h",
  };

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
