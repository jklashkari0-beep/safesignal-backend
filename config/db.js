const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log("URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Name:", conn.connection.name);
    console.log("Connected:", conn.connection.host);

  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDB;