const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    serialNumber: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: false,
    },
    product_information: {
      company: {
        type: String,
        required: false,
      },
      details: {
        type: String,
        required: false,
      },
    },
    expiration_date: {
      product_manufacture: {
        type: Date,
      },
      product_expire: {
        type: Date,
      },
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
