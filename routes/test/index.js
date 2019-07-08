const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  res.render('index', {
    title: 'This is a test authentication protected route.',
    content: 'Authentication works!'
  })
});

module.exports = router;