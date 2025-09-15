const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("=================" + process.env.DB_USERNAME);
    console.log("=================" + process.env.DB_PASSWORD);
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@airbnb.rtqc7ov.mongodb.net/`
    );
    console.log("DB connectedd");
  } catch (error) {
    console.log("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
