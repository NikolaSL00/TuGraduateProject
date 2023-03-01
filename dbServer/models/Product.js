const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  unit: {
    type: String,
  },
  store: {
    type: mongoose.Types.ObjectId,
    ref: "Store",
  },
  imageUrl: {
    type: String,
  },
});

const Product = mongoose.model("Product", userSchema);

module.exports = Product;
