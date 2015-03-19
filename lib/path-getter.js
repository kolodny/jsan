module.exports = pathGetter;

function pathGetter(obj, path) {
  if (path !== '$') {
    var paths = getPaths(path);
    for (var i = 0; i < paths.length; i++) {
      path = paths[i].toString().replace(/\\"/g, '"');
      obj = obj[path];
    }
  }
  return obj;
}

function getPaths(pathString) {
  var regex = /\["((?:[^\\"]|\\.)*)"\]|\[(\d+)\]/g;
  var matches = [];
  var match;
  while (match = regex.exec(pathString)) {
    matches.push( match[2] ? +match[2] : match[1] );
  }
  return matches;
}
