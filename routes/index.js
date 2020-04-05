var express = require('express');
var router = express.Router();
var auth = require('./auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  var content = 'Welcome home!';
  if(req.user) {
    content = 'Welcome home, ' + req.user.username + '!'
  }
  res.render('index', { 
    title: 'Home Page',
    content
  });
});

/* User */
router.use('/user', require('./user.js'));

/* Markdown */
router.use('/md', require('./md'));

/* Test */
router.use('/test', require('./test'));

module.exports = router;
