const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  mec_number: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  email: { 
    type: String,
    unique: true,
    sparse: true
  },
  type: String,
  creation_date: Date,
  active: Boolean
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)
