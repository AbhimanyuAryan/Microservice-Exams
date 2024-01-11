var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')

var mongoose = require('mongoose');

const inDocker = process.env.IN_DOCKER === 'true';

let mongoDB;
if (inDocker) {
  mongoDB = process.env.MONGO_URL + 'RAS_AUTH'
} else {
  mongoDB = `mongodb://localhost:27017/RAS_AUTH`;
}

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB...'));
db.once('open', function() {
  console.log("Connection to MongoDB was successful...")
});

var User = require('./models/user');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({
  secret: 'RAS',
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true,
      secure: true
  }
}))

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.jsonp({ error: err })
});

module.exports = app;
