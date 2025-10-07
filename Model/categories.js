const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  // _id: {
  //   required: true,
  //   type: mongoose.Schema.ObjectId,
  // },
  name: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
});

module.exports = mongoose.model("categories", categorySchema);
