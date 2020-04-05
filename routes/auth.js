/*
  AUTHENTICATION

*/

const createError = require('http-errors');

/*
  Checks if the token holder is a User
*/
const isUser = function (req, res, next) {
  const { payload: { id } } = req;

  User.findById(id)
    .then((user) => {
      if(!user) {
        return res.status(400).json({
          errors: { auth: 'user not found' }
        });
      }
      
      req.user = user;
      next();
    });
}

const required = function(req, res, next) {
  if(!req.user) {
    return next(createError(401));
  } else {
    next();
  }
}

const admin = function(req, res, next) {
  if(!req.user || req.user.roleId !== 1) {
    return next(createError(401));
  } else {
    next();
  }
}

/*
  Authentication methods for requests
*/
const auth = {
  required,
  admin
};

module.exports = auth;