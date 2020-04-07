const express = require('express');
const router = express.Router();
const auth = require('../auth');
const Leaf = require('../../models/Leaf');
var createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const treejs = require('../../helpers/tree');

// TO-DO:
// - Can only view user's own leafs
// - CRUD: Create, read, update, delete
//    - move


// GET /: /md/root
router.get('/', auth.required, (req, res, next) => {
  res.redirect('/md/root');
});

// GET: Get the full folder tree.
router.get('/folder_tree', auth.required, (req, res, next) => {
  // Get paths of all leafs belonging to user
  Leaf.find({ $or: [{ "ancestors.id": req.user.rootLeaf }, { _id: req.user.rootLeaf }] }, (err, docs) => {
    if(err) {
      console.log(err);
      return res.json({'error': true});
    }
    if(docs) {
      
      // Build paths array from all docs
      // At the same time, build id to name dictionary (for building the tree later on)
      let pathNameDictionary = {};
      let pathsArray = docs
          .filter((doc) => { return (doc.type === 'folder' || doc.type === 'root') })
          .map((doc) => {
            let ancestor_ids = doc.ancestors.map(function(ancestor) { return ancestor.id });
            pathNameDictionary[doc._id] = doc.name;
            return [...ancestor_ids, doc._id]
          });

      console.log('paths', pathsArray);

      // Build tree object from paths array
      let tree = treejs.getParsedTreeFromPaths(pathsArray, pathNameDictionary);
      res.send(tree['nodes']);
      res.end();
      
    } else {
      res.json({'error': true});
      res.end();
    }
  });
});

// GET: View a folder or markdown file
router.get('/:id', auth.required, (req, res, next) => {
  let isRoot = (req.params.id == undefined || req.params.id === 'root');

  // Validate ObjectID (https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid)
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/) || req.params.id === 'root') {
    
  } else {
    return next(createError(404, 'Not found!'));
  }

  Leaf.findOne({ _id: isRoot ? req.user.rootLeaf : req.params.id }, (err, current_doc) => {
    if(err || current_doc == undefined) {
      console.log(err);
      return next(createError(404, 'Leaf not found!'));
    }
    if(current_doc) {
      Leaf.find({ parent: current_doc._id }, (err, docs) => {
        if(err) { 
          console.log(err);
          req.flash('error', "Can't create new here!")
          return res.redirect('/md/root');
        }
        let data = {
          current: current_doc,
          ancestors: current_doc.ancestors, // For showing the current path
          children: docs // For showing the chilren, if current doc is a folder.
        }
        return res.render('md', data);
      })
    } else {
      return next(createError(404, 'Not found!'));
    }
  });
});

// POST: Create new folder or markdown file in current leaf.
router.post('/:id/new', auth.required, (req, res, next) => {
  
  if(!req.body.name || !req.body.type) {
    req.flash('error', "Missing name or type!");
    return res.redirect(`/md/${req.params.id}`);
  }

  let isRoot = (req.params.id == undefined || req.params.id === 'root');
  Leaf.findOne({ _id: isRoot ? req.user.rootLeaf : req.params.id }, (err, current_doc) => {
    if(err || current_doc == undefined) {
      console.log(err);
      return next(createError(404, 'Leaf not found!'));
    }
    // Must be folder or root
    if(current_doc && (current_doc.type === 'folder' || current_doc.type === 'root')) {
      let leaf = new Leaf({ 
        name: req.body.name,
        type: req.body.type,
        ancestors: [...current_doc.ancestors, { name: current_doc.name, id: current_doc._id }],
        parent: current_doc._id
      })
      leaf.save((err, new_saved) => {
        if(err) { 
          console.log(err); 
          return res.redirect('/md/root'); 
        }
        req.flash('success', "Successfully created!");
        return res.redirect(`/md/${new_saved._id}`);
      });
    } else {
      req.flash('error', "Can't create new here!");
      return res.redirect('/md/root');
    }
  });
});

// POST: Edit markdown file.
router.post('/:id/edit', auth.required, (req, res, next) => {
  let isRoot = (req.params.id == undefined || req.params.id === 'root');

  Leaf.findOne({ _id: isRoot ? req.user.rootLeaf : req.params.id }, (err, current_doc) => {
    if(err || current_doc == undefined) {
      console.log(err);
      return next(createError(404, 'Leaf not found!'));
    }
    current_doc.content = req.body.content;
    current_doc.last_updated = new Date();
    current_doc.save(function(err, doc) {
      res.json({'msg': 'success'});
      res.end();
    })
  });
});


// POST: Delete markdown file or folder.
router.post('/:id/delete', auth.required, (req, res, next) => {
  let isRoot = (req.params.id == undefined || req.params.id === 'root');

  Leaf.findOne({ _id: isRoot ? req.user.rootLeaf : req.params.id }, (err, current_doc) => {
    if(err || current_doc == undefined) {
      console.log(err);
      return next(createError(404, 'Leaf not found!'));
    }


  });
});

// POST: Move markdown file or folder.
router.post('/:id/move', auth.required, (req, res, next) => {
  let isRoot = (req.params.id == undefined || req.params.id === 'root');

  Leaf.findOne({ _id: isRoot ? req.user.rootLeaf : req.params.id }, (err, current_doc) => {
    if(err || current_doc == undefined) {
      console.log(err);
      return next(createError(404, 'Leaf not found!'));
    }


  });
});



function constructTree(rootId, history, level, max_level, callback) {

  level++;
  if(level > max_level) {
    callback(rootId);
    return;
  }
  
  Leaf.find({ parent: rootId }, function (err, children) {
    if(err) { return onResult(false); }
    
    if(children) {
      history[rootId] = [];
      for(var child of children) {
        if(child.type === 'folder' || child.type === 'root') {
          constructTree(child._id, level, max_level, callback);
        } else {
          callback(child);
        }
      }
    }
  });
}

module.exports = router;
