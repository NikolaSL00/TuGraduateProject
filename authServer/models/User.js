const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/env");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  address: {
    type: mongoose.Types.ObjectId,
    ref: "Address",
  },
});

userSchema.pre("save", function (next) {
  bcrypt
    .hash(this.password, SALT_ROUNDS)
    .then((hashedPassword) => {
      this.password = hashedPassword;
      next();
    })
    .catch((err) => console.log(err));
});

// userSchema.path('username').validate(function (usernameValue) {
//   return usernameValue && usernameValue.length >= 5;
// }, 'The username should be at least five characters long');

const User = mongoose.model("User", userSchema);

module.exports = User;
