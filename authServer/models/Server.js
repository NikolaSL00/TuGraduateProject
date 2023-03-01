const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/env");

const serverSchema = new mongoose.Schema({
  serverName: {
    type: String,
    required: [true, "Server name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

serverSchema.pre("save", function (next) {
  bcrypt
    .hash(this.password, SALT_ROUNDS)
    .then((hashedPassword) => {
      this.password = hashedPassword;
      next();
    })
    .catch((err) => console.log(err));
});

// serverSchema.path('username').validate(function (usernameValue) {
//   return usernameValue && usernameValue.length >= 5;
// }, 'The username should be at least five characters long');

const Server = mongoose.model("Server", serverSchema);

module.exports = Server;
