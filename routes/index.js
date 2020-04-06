var express = require('express');
var router = express.Router();
var auth = require('./auth');
var fs = require('fs');
var path = require("path");
let introduction = '';

fs.readFile(path.resolve(__dirname, "../config/Introduction.md"), (err, data) => {
  if (err) throw err;
  introduction = data;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var content = 'Welcome home!';
  if(req.user) {
    content = 'Welcome home, ' + req.user.username + '!'
  }
  res.render('index', { 
    title: 'Markdown Journal v.1',
    content,
    introduction
  });
});

/* User */
router.use('/user', require('./user.js'));

/* Markdown */
router.use('/md', require('./md'));

/* Test */
router.use('/test', require('./test'));

module.exports = router;
