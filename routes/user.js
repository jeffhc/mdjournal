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

//POST new user route
router.post('/create', auth.required, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new User(user);

  finalUser.generateHash(user.password);
  finalUser.generateRootLeaf((rootLeafID) => {
    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }));
  });
});

//GET current route (required, only authenticated users have access)
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