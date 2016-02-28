var cycle = require('./cycle');

exports.stringify = function stringify(value, replacer, space, _options) {

  var options = _options !== true ? _options : {
    'date': true,
    'function': true,
    'regex': true,
    'undefined': true,
  };

  try {
    if (!options) {
      if (arguments.length === 1) {
        return JSON.stringify(value);
      } else {
        return JSON.stringify.apply(JSON, arguments);
      }
    }
  } catch (e) {}
  var decycled = cycle.decycle(value, options || {});
  if (arguments.length === 1) {
    return JSON.stringify(decycled);
  } else {
    return JSON.stringify(decycled, replacer, space);
  }

}

exports.parse = function parse(text, reviver) {
  var needsRetrocycle = /"\$jsan+"/.test(text);
  var parsed;
  if (arguments.length === 1) {
    parsed = JSON.parse(text);
  } else {
    parsed = JSON.parse(text, reviver);
  }
  if (needsRetrocycle) {
    parsed = cycle.retrocycle(parsed);
  }
  return parsed;
}
