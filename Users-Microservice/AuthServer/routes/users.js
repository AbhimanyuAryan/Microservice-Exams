var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require('jsonwebtoken')
var auth = require('../auth/auth')
var User = require('../controllers/user')
var userModel = require('../models/user')


var fse = require('fs-extra');
var path = require('path');
var multer = require('multer');




function get_JWT_user(user) {
  var jwt_user = user.toObject()
  delete jwt_user.salt
  delete jwt_user.hash

  return jwt_user;
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

router.get('/users/profile', auth.verifyAccess, function (req, res) {
  User.getUser(req.user._id)
    .then(data => {
      res.jsonp(data)
    })
    .catch(err => {
      res.status(404).jsonp({ error: 'Error the profile of the user: ' + err })
    })
})

router.post('/users/regist', function (req, res) {
  User.getIdProxUser()
    .then(id => {
      var new_user = {
        _id: id, type : req.body.type, name: req.body.name, username : req.body.mec_number ,mec_number: req.body.mec_number, email: req.body.email, active: true
      }

      password = req.body.password
      new_user.creation_date = getCurrentDateTime()
      userModel.register(new userModel(new_user),
        password,
        function (err, user) {
          if (err) {
            res.status(500).jsonp({ error: 'Error registing user: ' + err })
          }
          else {
            res.jsonp({ user: get_JWT_user(user) })
          }
        })
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Error registing user: ' + err });
    });
})

router.post('/users/registMany', async function (req, res) {
  const users = req.body.users;


  try {
    const registrations = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const id = await User.getIdProxUser();

      const new_user = {
        _id: id,
        type: user.type,
        name: user.name,
        username: user.mec_number,
        mec_number: user.mec_number,
        email: user.email,
        active: true
      };

      const password = user.password;
      new_user.creation_date = getCurrentDateTime();

      const registrationPromise = new Promise((resolve, reject) => {
        userModel.register(new userModel(new_user), password, function (err, registeredUser) {
          if (err) {
            reject(err);
          } else {
            resolve(get_JWT_user(registeredUser));
          }
        });
      });

      registrations.push(registrationPromise);
    }

    
    const registeredUsers = await Promise.all(registrations);
    res.jsonp({ users: registeredUsers });
  } catch (err) {
    res.status(500).jsonp({ error: 'Error processing user registrations: ' + err });
  }
});


router.post('/users/login', passport.authenticate('local'), function (req, res) {
  if (req.user.active) {
    var jwt_user = get_JWT_user(req.user);
    jwt.sign(jwt_user, 'RAS', { expiresIn: "365d" }, function (err, token) {
      if (err) {
        res.status(500).jsonp({ error: 'Error logging user in: ' + err });
      } else {
        res.jsonp({token: token });
      }
    });
  }
  else {
    res.status(404).jsonp({ error: 'Error logging user in: User not found.' });
  }

})



router.put('/users/edit', auth.verifyAccess, async function (req, res) {
  var old_user = req.user
  var id = req.user._id
  var new_values = req.body

  var new_password = false
  if (req.body.new_password && req.body.new_password_confirm && req.body.new_password === req.body.new_password_confirm) {
    new_password = req.body.new_password
  }


  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, new_values, { new: true });

    if (new_password) {
      await new Promise((resolve, reject) => {
        updatedUser.setPassword(new_password, (err_setPassword, user) => {
          if (err_setPassword) {
            reject(err_setPassword);
          }
          else {
            resolve(user);
          }
        });
      });

      await updatedUser.save();
    }

    const jwt_user = get_JWT_user(updatedUser);
    const token = await new Promise((resolve, reject) => {
      jwt.sign(jwt_user, 'RAS', { expiresIn: 86400000 }, (err_jwt, token) => {
        if (err_jwt) {
          reject(err_jwt);
        }
        else {
          resolve(token);
        }
      });
    });

    res.jsonp({token : token});
  }
  catch (err) {
    res.status(500).jsonp({ error: 'Error updating user: ' + err });
  }
})

router.delete('/users/remove', auth.verifyAccess, function (req, res) {
  User.updateUser(req.user._id, { active: false })
    .then(response => {
      if (response) {
        res.jsonp(response)
      }
      else {
        res.status(404).jsonp({ error: 'User to remove not found.' })
      }
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Error removing user: ' + err })
    })
});

module.exports = router;
