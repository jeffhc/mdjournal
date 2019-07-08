/*
    Written by Jeffrey Cao, 2019.
    The following passport strategy contains snippets from
    https://reallifeprogramming.com/node-authentication-with-passport-postgres-ef93e2d520e7
    and 
    https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e   
*/


const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')

const User = mongoose.model('User');

// const user = {
//   username: 'test-user',
//   passwordHash: 'bcrypt-hashed-password',
//   id: 1
// }

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  }, 
  (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if(!user || !user.validatePassword(password)) {
          return done(null, false, { message: 'Username or password is invalid.' } );
        }

        return done(null, user, { message: 'Successfully logged in!' });
      }).catch(done);
    }
));

// passport.use(new LocalStrategy(
//   (username, password, done) => {
//      findUser(username, (err, user) => {
//        if (err) {
//          return done(err)
//        }
 
//        // User not found
//        if (!user) {
//          return done(null, false)
//        }
 
//        // Always use hashed passwords and fixed time comparison
//        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
//          if (err) {
//            return done(err)
//          }
//          if (!isValid) {
//            return done(null, false)
//          }
//          return done(null, user)
//        })
//      })
//    }
//  ))


