var createError = require('http-errors');
const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// For auth system
var mysql = require('mysql');

var con = mysql.createConnection({ // Change this when going live
  host: "localhost",
  user: "root",
  password: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

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
// For auth system
app.use(express.urlencoded({extended: 'false'}));
app.use(express.json());

// --- Connect URL Params to page controllers ---
app.use('/inbox', inboxRouter);

// Account Related
app.use('/', indexRouter); // Login Page
app.use('/signup', signUpRouter);
app.use('/account', accountRouter);
app.use('/logout', logoutRouter);

// Sign Up DB Operations
app.post("signup", (req, res) => {    
  const { username, password, password_confirm } = req.body

  db.query('SELECT username FROM users WHERE username = ?', [username], async (error, res) => {
    if(error){
      console.log(error)
    }

    // Make sure username doesn't already exist and that passwords match
    if( result.length > 0 ) {
      return res.render('signup', {
          message: 'This username is already in use'
      });
    } else if(password !== password_confirm) {
        return res.render('signup', {
            message: 'Passwords do not match!'
        });
    }
    
    // Add user account to db
    let hashedPassword = await bcrypt.hash(password, 8)

        db.query('INSERT INTO users SET?', {Username: username, password: hashedPassword}, (err, res) => {
            if(error) {
                console.log(error)
            } else {
                return res.render('login', {
                    message: 'User registered!'
                });
            }
        });
  });
});

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
