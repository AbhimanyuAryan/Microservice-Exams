const mongoose = require('mongoose')

var counterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});

module.exports = mongoose.model('counter', counterSchema)
