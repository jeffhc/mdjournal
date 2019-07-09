var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
// var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
const session = require('express-session');
var config = require('./config/Config');
var flash = require('connect-flash');
var passport = require('passport');

var User = require('./models/User');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure Mongoose
mongoose.connect('mongodb://localhost/epsas',
  { useNewUrlParser: true }
);
// mongoose.set('debug', true);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: config.secret, resave: false, saveUninitialized: false })); // cookie: { maxAge: 60000 }, 
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser(config.secret));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Pass always available local variables to render
// USER and MESSAGES will ALWAYS be available to render views!
// Make sure you don't pass them in the render function!
function userView(req, res, next) {
  res.locals.user = req.user;
  next();
}
function messages(req, res, next) {
  res.locals.messages = [...req.flash('success'), ...req.flash('info'), ...req.flash('error')];
  next();
}
app.use(userView);
app.use(messages);

// Models and routes
require('./models/User');
require('./config/passport');
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Sorry, couldn't find the page you were looking for!"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
