const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  passwordHash: {
    required: true,
    type: String,
  },
  fName: {
    required: true,
    type: String,
  },
  lName: {
    required: true,
    type: String,
  },
  address: {
    required: false,
    type: String,
  },
  phoneNum: {
    required: true,
    type: String,
  },
  regisDate: {
    required: true,
    type: Date,
  },
  updateDate: {
    required: true,
    type: Date,
  },
  isActive: {
    required: true,
    type: Boolean,
  },
});

module.exports = mongoose.model("users", usersSchema);
