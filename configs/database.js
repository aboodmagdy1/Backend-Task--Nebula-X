const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.DB_URI || "mongodb://localhost:27017/ecommerceTask"
    );
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
