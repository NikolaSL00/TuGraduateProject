const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  address: {
    type: mongoose.Types.ObjectId,
    ref: "Address",
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Store = mongoose.model("Store", userSchema);

module.exports = Store;
