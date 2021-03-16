const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const exphbs = require('express-handlebars');
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

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server is in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
