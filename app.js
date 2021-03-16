const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require('./config/passport')(passport);

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

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server is in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
