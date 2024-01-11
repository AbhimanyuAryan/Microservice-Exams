const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
  notifier_id: String,
  notifier_name: String,
  date : Date,
  title: String,
  description: String,
  read: Boolean
});

var userNotificationSchema = new mongoose.Schema({
  _id: String,
  name: String,
  notifications: [notificationSchema]
});

module.exports = mongoose.model('notification', userNotificationSchema);
