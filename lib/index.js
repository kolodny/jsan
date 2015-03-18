var cycle = require('./cycle');

exports.stringify = function stringify(value, replacer, space) {
  var decycled = cycle.decycle(value);
  return JSON.stringify(decycled, replacer, space);
}

exports.parse = function parse(text, reviver) {
  var parsed = JSON.parse(text, reviver)
  return cycle.retrocycle(parsed);
}
