var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('../config/env');

var jwt = require('jsonwebtoken')

function verifyUser(req, res, next) {
  var token = req.cookies.token
  if (token) {
    jwt.verify(token, 'RAS', function (err, payload) {
      if (err) {
        res.status(401).render('error', getErrorViewObject({ 'code': '401' }, 'Error obtaining user.'))
      }
      else {
        req.user = payload;
        next();
      }
    })
  }
  else {
    res.status(401).render('error', getErrorViewObject({ 'code': '401' }, 'Session expired.'))
  }
}


function getErrorViewObject(err, message) {
  console.error(err)
  if (err.response) {
    var error = { error: { status: err.response.status }, message: message }
  }
  else {
    var error = { error: { status: err.code }, message: message };
  }
  return error
}

router.get('/registteacherform', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/registeacherform')
});

router.get('/registteachersform', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/registeachersform')
});



router.get('/registstudentform', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/registstudentform')
});


router.get('/registstudentsform', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/registstudentsform')
});


router.get('/registteacher', function (req, res, next) {
    res.redirect(env.UserInterface_main + '/registteacher')
});

router.get('/registstudent',function (req, res, next) {
  res.redirect(env.UserInterface_main + '/registstudent')
});

router.get('/login', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/login')
});

router.get('/logout', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/logout')
});

router.get('/profile', function (req, res, next) {
    res.redirect(env.UserInterface_main + '/profile')
});

router.get('/profile/edit', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/profile/edit')
});


router.get('/home', function (req, res, next) {
  res.redirect('/')
});

router.get('/', function (req, res, next) {
  res.redirect(env.UserInterface_main + '/')
});

router.get('/profile/remove', verifyUser, function (req, res, next) {
  res.redirect(env.UserInterface_main + '/profile/remove')
})

router.get('/notifications', verifyUser, function (req, res, next) {
  
  const token = req.cookies.token
  user = req.user

  axios.get(env.APIServer_main, { headers: { authorization: token }})
    .then(response => {
      res.render('notifications', { notifications : response.data, user: req.user })
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'Not possible to see notifications.'))

      }
      else {
      
        res.status(err.code).render('error', getErrorViewObject(err, 'Not possible to see notifications.'))
      }

    })
});

router.get('/notification/:id', verifyUser, function (req, res, next) {
  
  const id = req.params.id
  const token = req.cookies.token

  axios.get(env.APIServer_main + '/get/' +id, {
    headers: { authorization: token }
  })
    .then(response => {
      res.render('notification', { notification: response.data, user: req.user });
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'Not possible to see notification.'));
      } else {
        res.status(err.code).render('error', getErrorViewObject(err, 'Not possible to see notification.'));
      }
    })
});


module.exports = router;
