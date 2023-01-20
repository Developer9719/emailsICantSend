var createError = require('http-errors');
const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// DB Connection Varibales
dotenv.config({ path: './.env'});

// Open a connection to the db
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

db.connect((error) => {
  if(error) {
      console.log(error)
  } else {
      console.log("MySQL connected!")
  }
});

// --- Page Controllers ---
var inboxRouter = require('./routes/inbox');

//Account Related
var indexRouter = require('./routes/index'); // Login Page
var signUpRouter = require('./routes/signup');
var accountRouter = require('./routes/account');
var logoutRouter = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Connect URL Params to page controllers ---
app.use('/inbox', inboxRouter);

// Account Related
app.use('/', indexRouter); // Login Page
app.use('/signup', signUpRouter);
app.use('/account', accountRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
