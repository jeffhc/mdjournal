const router = require('express').Router();

const auth = require('./auth');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// GET account page.
router.get('/', auth.required, (req, res, next) => {
  res.render('account');
});

// POST dark mode
router.post('/darkmode', auth.required, (req, res, next) => {
  req.user.darkMode = req.body.darkMode === 'on' ? true : false;
  req.user.save(function(err, doc) {
    if(err || !doc) {
      console.log(err);
      req.flash('error', 'Failed to switch to dark mode!')
      res.redirect('/user/account');
    } else {
      req.flash('success', 'Toggled dark mode!')
      res.redirect('/user/account');
    }
  });
});

// POST preview default
router.post('/previewDefault', auth.required, (req, res, next) => {
  req.user.previewDefault = req.body.previewDefault === 'on' ? true : false;
  req.user.save(function(err, doc) {
    if(err || !doc) {
      console.log(err);
      req.flash('error', 'Failed to switch to preview as default!')
      res.redirect('/user/account');
    } else {
      req.flash('success', `Toggled ${req.user.previewDefault ? 'on' : 'off'} Preview Mode as default!`)
      res.redirect('/user/account');
    }
  });
});


module.exports = router;