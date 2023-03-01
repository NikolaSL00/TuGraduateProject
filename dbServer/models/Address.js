const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
});

const Address = mongoose.model("Address", userSchema);

module.exports = Address;
