let paths = ["About.vue","Categories/Index.vue","Categories/Demo.vue","Categories/Flavors.vue","Categories/Types/Index.vue","Categories/Types/Other.vue"];

let result = [];
let level = {result, tags_count: 0};

paths.forEach(path => {
  path.split('/').reduce((r, name, i, a) => {
    // console.log(level);
    if(!r[name]) {
      r[name] = {result: [], tags_count: 0};
      r.result.push({name, children: r[name].result })
    }
    r.tags_count = r.result.length;
    
    return r[name];
  }, level)
})

// console.log(level)

function build_new_tree(name, obj) {
  let result_obj = { name, children: [], count: 0 }
  if(obj['result'] && obj['result'].length) {
    result_obj['count'] = obj['tags_count'];
    result_obj['children'] = [];
    for(var key of Object.keys(obj)) {
      if(key != 'tags_count' && key != 'result') {
        if(obj[key]['result'] && obj[key]['result'].length) {
          result_obj['children'].push(build_new_tree(key, obj[key]));  
        }
        else {
          result_obj['children'].push({ name: key, count: 0 });
        }
      }
    }
  }
  return result_obj;
}

let new_tree = build_new_tree('root', level);

console.log(JSON.stringify(new_tree));