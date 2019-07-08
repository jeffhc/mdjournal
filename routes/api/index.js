const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/users', require('./users'));


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
    failureRedirect:'/api/login', 
    failureFlash: true,
    successFlash: true,
  }),
);

router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('info', 'Successfully logged out!')
  res.redirect('/');
})


module.exports = router;