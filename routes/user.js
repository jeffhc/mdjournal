/*
    ROUTE FILE
    
    /user

    Routes:
      - GET /user/login
      - POST /user/login
      - GET /user/logout
      - POST /user/create
      - GET /user/current
*/


const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const User = mongoose.model('User');


// GET login route
router.get('/login', (req, res, next) => {
  if(!req.user) {
    return res.render('login', {
      title: 'Login'
    })
  }
  req.flash('error', "You're already logged in!")
  return res.redirect('/')
});

// POST login route (optional, everyone has access)
router.post('/login',
  passport.authenticate('local', {
    successRedirect:'/', 
    failureRedirect:'/user/login', 
    failureFlash: true,
    successFlash: true,
  })
);

// GET logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('info', 'Successfully logged out!')
  res.redirect('/');
})

// GET new user route
router.get('/create', auth.admin, (req, res, next) => {
  res.render('create_user')
});

// POST new user route
router.post('/create', auth.admin, (req, res, next) => {
  const { body: { username, password, roleId } } = req;

  if(!username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!roleId) {
    return res.status(422).json({
      errors: {
        roleId: 'is required',
      },
    });
  }

  const finalUser = new User({
    username,
    password,
    roleId
  });

  finalUser.generateHash(password);
  finalUser.generateRootLeaf((rootLeafID) => {
    return finalUser.save().then(() => {
      // res.json({ user: finalUser.toAuthJSON() })
      req.flash('success', 'Successfully created user!');
      res.redirect('/');
    });
  });
});

// account paths
router.use('/account', require('./account'));

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return User.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ path: 'current', user: user.toAuthJSON() });
    });
});

module.exports = router;