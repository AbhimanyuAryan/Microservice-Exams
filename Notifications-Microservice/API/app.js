var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const inDocker = process.env.IN_DOCKER === 'true';

let mongoDB;
if (inDocker) {
  mongoDB = process.env.MONGO_URL + 'RAS_NOTIFICATION'
} else {
  mongoDB = `mongodb://localhost:27017/RAS_NOTIFICATION`;
}


var mongoose = require('mongoose');


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB...'));
db.once('open', function() {
  console.log("Connection to MongoDB was successful...")
});


var notificationsRouter = require('./routes/notifications');

var app = express();






app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', notificationsRouter);

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
