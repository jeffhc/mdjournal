const Log = require('../models/Log');
const console_output = true;

module.exports = {

  requiredBody: function(fields, req, res) {
    var errors = []
    if(fields) {
      for(field of fields) {
        if(!req.body.hasOwnProperty(field)) {
          errors.push({ missing_field: field + ' not found' });
        }
      }
      if(errors.length) {
        return res.status(422).json({ errors });
      }
    }
    return null;
  },

  isEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  },

  log: function(type, msg) {
    const newLog = new Log({
      type,
      msg
    });
    newLog.save().then(saved => {
      if(console_output) {
        console.log('--> '+type+': '+msg);
      }
    }).catch(err => {
      if(err) {console.log('logging error', err)}
    })
  }
}