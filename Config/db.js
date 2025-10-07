const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ecom.wgcuusc.mongodb.net/eCom`
    );
    console.log("DB connectedd");
  } catch (error) {
    console.log("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
