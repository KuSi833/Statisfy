const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

// Connect database
connectDB();

const app = express();

// Morgan Logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan('dev'));
}
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server is in ${process.env.NODE_ENV} mode on port ${PORT}`)
);