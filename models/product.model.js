const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  salePrice: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
