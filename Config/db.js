const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${progress.env.DB_Username}:${process.env.DB_Passw0rd}@airbnb.rtqc7ov.mongodb.net/`
    );
    console.log("DB connectedd");
  } catch (error) {
    console.log("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
