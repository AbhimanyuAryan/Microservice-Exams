var jwt = require('jsonwebtoken')

module.exports.verifyAccess = function (req, res, next) {
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
