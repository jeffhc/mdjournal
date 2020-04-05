const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LeafSchema = new Schema({
  created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },

  ancestors: [{ 
    name: String,
    id: ObjectId
  }], // Used for creating the path
  parent: ObjectId,
  type: { type: String, required: true }, // type is either markdown, folder, or root

  name: {type: String, required: true},
  content: String,

});

module.exports = mongoose.model('Leaf', LeafSchema);
