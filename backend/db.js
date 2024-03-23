const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

let connectDB = async () => {
  let conn;
  try {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  console.log(`MongoDB connected to ${conn.connection.host}`);

  return conn;
};

const db = connectDB();
exports.db = db;
exports.connectDB = connectDB;
