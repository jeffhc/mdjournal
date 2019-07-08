const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/Config');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String },
  
  hash: String,
  salt: String,
  
  roleId: Number, // 0 is user, 1 is photographer, 2 is admin,

});

/* 

    The following methods for user authentication (salting, hashing, validating)
    are insecure. SHA512 can be brute forced. Please see 
    https://hackernoon.com/your-node-js-authentication-tutorial-is-wrong-f1a3bf831a46
    and 
    https://codahale.com/how-to-safely-store-a-password/
    
*/

// UserSchema.methods.setPassword = function(password) {
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
// };

// UserSchema.methods.validatePassword = function(password) {
//   const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//   return this.hash === hash;
// };


UserSchema.methods.generateHash = function(password) {
  this.salt = bcrypt.genSaltSync(8);
  this.hash = bcrypt.hashSync(password, this.salt, null);
  return this.hash;
};

// Make sure this compare is synchronous, otherwise passport may return the user before compare is finished.
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.hash);
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    username: this.username,
    id: this._id,
    // exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, config.secret);
}

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', UserSchema);