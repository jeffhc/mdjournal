const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  type: String,
  msg: String,
});

module.exports = mongoose.model('Log', LogSchema);
