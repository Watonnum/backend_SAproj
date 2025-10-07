const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  // _id: {
  //   required: true,
  //   type: mongoose.Schema.ObjectId,
  // },
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  inStock: {
    required: true,
    type: Number,
  },
  description: {
    required: false,
    type: String,
  },
  categoryId: {
    required: true,
    ref: "categories",
    type: mongoose.Schema.ObjectId,
  },
  images: {
    required: false,
    type: String,
  },
  isAvailable: {
    required: true,
    type: Boolean,
  },
});

module.exports = mongoose.model("products", productSchema);
