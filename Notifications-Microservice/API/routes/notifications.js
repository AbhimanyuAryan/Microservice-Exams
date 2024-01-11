var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var Notification  = require('../controllers/notification')



function verifyUser(req, res, next) {
  var token = req.headers.authorization;
  if (token) {
    jwt.verify(token, 'RAS', function(err, payload) {
      if (err) {
        res.status(403).jsonp({ error: err });
      }
      else {
        req.user = payload;
        next();
      }
    })
  }
  else {
    res.status(401).jsonp({ error: 'Token does not exist!' });
  }
}

function verifyTechnician(req, res, next) {
  var user = req.user
  if (user.type === 'technician') {
    next()
  }
  else {
    res.status(401).render('error', getErrorViewObject({ 'code': '401' }, 'No permissions.'))
  }
}

function verifyTechnicianOrTeacher(req, res, next) {
  var user = req.user
  if (user.type === 'technician' || user.type === 'teacher') {
    next()
  }
  else {
    res.status(401).render('error', getErrorViewObject({ 'code': '401' }, 'No permissions.'))
  }
}

function getCurrentDateTime() {
  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return new Date(Date.UTC(year, month, day, hours, minutes, seconds))
}

router.get('/notifications', verifyUser, function (req, res)
{
    const user = req.user
  
  
    Notification.getAllNotificationsForUser(user._id)
    .then(data => {
      res.jsonp(data)
    })
    .catch(err => {
      res.status(404).jsonp({ error: 'Error getting the notifications of the user: ' + err })
    })
})

router.get('/notifications/count', verifyUser, function (req, res)
{
    const user = req.user
  
  
    Notification.countAllNonReadNotificationsForUser(user._id)
    .then(data => {
      res.jsonp({'count' : data})
    })
    .catch(err => {
      res.status(404).jsonp({ error: 'Error getting the notifications of the user: ' + err })
    })
})

router.get('/notifications/get/:id', verifyUser, function (req, res)
{
    const user = req.user
    notif_id = req.params.id


    Notification.markNotificationAsRead(user._id, notif_id)
    .then(data => {
      res.jsonp(data)
    })
    .catch(err => {
      res.status(404).jsonp({ error: 'Error getting the notifications of the user: ' + err })
    })
})

router.post('/notifications/createTeacher', verifyUser, verifyTechnician, function (req, res)
{
  const user = req.body

  const newUserNotification = {_id : user._id, name : user.name, notifications : []}

  Notification.addUserNotification(newUserNotification)
  .then(data => {
    res.jsonp(data)
  })
  .catch(err => {
    res.status(404).jsonp({ error: 'Error the profile of the user: ' + err })
  })
})

router.post('/notifications/createStudent', verifyUser, verifyTechnicianOrTeacher, function (req, res)
{
  const user = req.body

  const newUserNotification = {_id : user._id, name : user.name, notifications : []}

  Notification.addUserNotification(newUserNotification)
  .then(data => {
    res.jsonp(data)
  })
  .catch(err => {
    res.status(404).jsonp({ error: 'Error the profile of the user: ' + err })
  })
})


router.post('/notifications/createTeachers', verifyUser, verifyTechnician, function (req, res)
{
  const users = req.body

  const newUsers = users.map(user => ({
    _id: user._id,
    name: user.name,
    notifications: []
  }));
  

  Notification.addUserNotifications(newUsers)
  .then(data => {
    res.jsonp(data)
  })
  .catch(err => {
    res.status(404).jsonp({ error: 'Error the profile of the user: ' + err })
  })
})

router.post('/notifications/createStudents', verifyUser, verifyTechnicianOrTeacher, function (req, res)
{
  const users = req.body

 
  const newUsers = users.map(user => ({
    _id: user._id,
    name: user.name,
    notifications: []
  }));

  Notification.addUserNotifications(newUsers)
  .then(data => {
    res.jsonp(data)
  })
  .catch(err => {
    res.status(404).jsonp({ error: 'Error the profile of the user: ' + err })
  })
})

router.post('/notifications/add', verifyUser, async function (req, res) {
  try {
      const user = req.user;
      const listNotification = req.body;

      for (let i = 0; i < listNotification.length; i++) {
          const notification = listNotification[i];
          const newNotification = {
              notifier_id: user._id,
              notifier_name: user.name,
              date: getCurrentDateTime(),
              title: notification.title,
              description: notification.description,
              read: false
          };

      
          await Notification.addNotificationToUser(notification.receiver_id, newNotification);
      }

      res.status(200).jsonp({ message: 'Notifications added successfully' });
  } catch (error) {
      res.status(500).jsonp({ error: 'Internal Server Error' });
  }
});








module.exports = router;
