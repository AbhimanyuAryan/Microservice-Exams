var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('../config/env');


var multer = require('multer');
var jwt = require('jsonwebtoken')

var upload = multer({
  fileFilter: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  }
});


function concatUniqueObjects(list1, list2) {
  var combinedList = list1.concat(list2);
  var uniqueList = Array.from(new Set(combinedList.map(obj => obj._id))).map(_id => combinedList.find(obj => obj._id === _id));

  return uniqueList;
}

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

function getUser(req, res, next) {
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
    next();
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

function verifyTeacher(req, res, next) {
  var user = req.user
  if (user.type === 'teacher') {
    next()
  }
  else {
    res.status(401).render('error', getErrorViewObject({ 'code': '401' }, 'No permissions.'))
  }
}

function verifyStudent(req, res, next) {
  var user = req.user
  if (user.type === 'student') {
    next()
  }
  else {
    res.status(401).render('error', getErrorViewObject({ 'code': '401' }, 'No permissions.'))
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

router.get('/registteacherform', verifyUser, verifyTechnician, function (req, res, next) {
  var user = req.user
  if (user) res.render('regist', { user: user })
  else res.render('regist', {})
});

router.post('/registteacherform', verifyUser, verifyTechnician,function (req, res, next) {
  req.body.type = 'teacher'
  axios.post(env.AuthServer_main + '/regist', req.body)
    .then(response => {
        
        axios.post(env.NoficationAPI_main + '/createTeacher', response.data.user, { headers: { authorization: req.cookies.token } })
        .then(response => {
          res.redirect('/')
        })
        .catch(err => {
          if (err.response) {
            res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))
    
          }
          else {
            res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))
          }
    
        }) 
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))

      }
      else {
        res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))
      }

    })
});

router.get('/registteachersform', verifyUser, verifyTechnician, function (req, res, next) {
  var user = req.user
  if (user) res.render('registMany', { user: user })
  else res.render('registMany', {})
});


router.post('/registteachersform', verifyUser, verifyTechnician, upload.single('jsonRegistFile'),function (req, res, next) {
  if (!req.file) {
    return res.status(400).render('error', getErrorViewObject(null, 'No JSON file provided.'));
  }

  const jsonData = JSON.parse(req.file.buffer.toString('utf-8'));

  if (!Array.isArray(jsonData)) {
    return res.status(400).render('error', getErrorViewObject(null, 'Invalid JSON format. Expected an array.'));
  }

  requiredFields = ["email", "name", "password", "mec_number"]

  for (const item of jsonData) {
    for (const field of requiredFields) {
      if (!item.hasOwnProperty(field)) {
        return res.status(400).render('error', getErrorViewObject(null, `Invalid JSON format. Missing "${field}" field.`));
      }
    }
  }

 
  jsonData.forEach(item => {
    item.type = 'teacher';
  });

  req.body.users = jsonData
 

  axios.post(env.AuthServer_main + '/registMany', req.body)
    .then(response => {
      axios.post(env.NoficationAPI_main + '/createTeachers', response.data.users, { headers: { authorization: req.cookies.token } })
      .then(response => {
        res.redirect('/')
      })
      .catch(err => {
        if (err.response) {
          res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))
  
        }
        else {
          res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))
        }
  
      }) 
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))

      }
      else {
        res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))
      }

    })
});



router.get('/registstudentform', verifyUser, verifyTechnicianOrTeacher, function (req, res, next) {
  var user = req.user
  if (user) res.render('regist', { user: user })
  else res.render('regist', {})
});

router.post('/registstudentform', verifyUser, verifyTechnicianOrTeacher,function (req, res, next) {
  req.body.type = 'student'
  axios.post(env.AuthServer_main + '/regist', req.body)
    .then(response => {
      axios.post(env.NoficationAPI_main + '/createStudent', response.data.user, { headers: { authorization: req.cookies.token } })
        .then(response => {
          res.redirect('/')
        })
        .catch(err => {
          if (err.response) {
            res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))
    
          }
          else {
            res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))
          }
    
        }) 

    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))

      }
      else {
        res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified user.'))
      }

    })
});


router.get('/registstudentsform', verifyUser, verifyTechnicianOrTeacher, function (req, res, next) {
  var user = req.user
  if (user) res.render('registMany', { user: user })
  else res.render('registMany', {})
});

router.post('/registstudentsform', verifyUser, verifyTechnicianOrTeacher, upload.single('jsonRegistFile'),function (req, res, next) {
  if (!req.file) {
    return res.status(400).render('error', getErrorViewObject(null, 'No JSON file provided.'));
  }

  const jsonData = JSON.parse(req.file.buffer.toString('utf-8'));

  if (!Array.isArray(jsonData)) {
    return res.status(400).render('error', getErrorViewObject(null, 'Invalid JSON format. Expected an array.'));
  }

  requiredFields = ["email", "name", "password", "mec_number"]

  for (const item of jsonData) {
    for (const field of requiredFields) {
      if (!item.hasOwnProperty(field)) {
        return res.status(400).render('error', getErrorViewObject(null, `Invalid JSON format. Missing "${field}" field.`));
      }
    }
  }


  jsonData.forEach(item => {
    item.type = 'student';
  });

  req.body.users = jsonData
  
  axios.post(env.AuthServer_main + '/registMany', req.body)
    .then(response => {
      axios.post(env.NoficationAPI_main + '/createStudents', response.data.users, { headers: { authorization: req.cookies.token } })
      .then(response => {
        res.redirect('/')
      })
      .catch(err => {
        if (err.response) {
          res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))
  
        }
        else {
          res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))
        }
  
      }) 
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))

      }
      else {
        res.status(err.code).render('error', getErrorViewObject(err, 'It was not possible to regist the specified users.'))
      }

    })
});

router.get('/registteacher', verifyUser, verifyTechnician,function (req, res, next) {
  var user = req.user
  if (user) res.render('registteacher', { user: user })
  else res.render('registteacher', {})
});

router.get('/registstudent', verifyUser, verifyTechnicianOrTeacher,function (req, res, next) {
  var user = req.user
  if (user) res.render('registstudent', { user: user })
  else res.render('registteacher', {})
});

router.get('/login', function (req, res, next) {
  res.clearCookie('user')
  res.clearCookie('token')
  var lastVisitedPage = req.headers.referer || '/';
  res.cookie('lastVisitedPage', lastVisitedPage);
  res.render('login', {});
});

router.get('/logout', function (req, res, next) {
  res.clearCookie('user')
  res.clearCookie('token')

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  });
});

router.get('/profile', verifyUser, function (req, res, next) {
  var user = req.user
  res.render('profile', { user: user })
});

router.get('/profile/edit', verifyUser, function (req, res, next) {
  var user = req.user
  res.render('editProfile', { user: user })
});


router.get('/home', function (req, res, next) {
  res.redirect('/')
});

router.get('/', getUser, function (req, res, next) {
  var user = req.user
  
  if (user) res.render('index', { user: user })
  else res.render('index', {})
});


router.post('/login', function (req, res, next) {
  axios.post(env.AuthServer_main + '/login', req.body)
    .then(response => {
      res.cookie('token', response.data.token, { secure: true, httpOnly: true, maxAge: 86400000 });
      res.redirect('/');
  
    })
    .catch(err => {
      console.error(err)
      const errorMessage = 'Wrong credencials! Press OK to try again...';
      const script = `<script>alert("${errorMessage}"); window.location.href = "/login";</script>`;
      res.send(script);
    })
});

router.post('/profile/edit', verifyUser, function (req, res, next) {
  
  const token = req.cookies.token


  axios.put(env.AuthServer_main + '/edit', req.body, { headers: { authorization: token } })
    .then(response => {
      res.cookie('token', response.data.token, { secure: true, httpOnly: true, maxAge: 86400000 });
      res.redirect('/profile')
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'Not possible to edit specified user.'))

      }
      else {
        res.status(err.code).render('error', getErrorViewObject(err, 'Not possible to edit specified user.'))
      }

    })
});

router.get('/profile/remove', verifyUser, function (req, res, next) {
  const token = req.cookies.token
  axios.delete(env.AuthServer_main + '/remove', { headers: { authorization: token } })
    .then(response => {
      res.redirect('/logout')
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).render('error', getErrorViewObject(err, 'Not possible to remove specified user.'))

      }
      else {
        res.status(err.code).render('error', getErrorViewObject(err, 'Not possible to remove specified user.'))
      }

    })
})

router.get('/notifications', function (req, res, next) {
  res.redirect(env.NoficationInterface_main+'/notifications')
})

module.exports = router;
