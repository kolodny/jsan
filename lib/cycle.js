var pathGetter = require('./path-getter');

// Based on https://github.com/douglascrockford/JSON-js/blob/master/cycle.js

/*
    cycle.js
    2013-02-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true, regexp: true */

/*members $ref, apply, call, decycle, hasOwnProperty, length, prototype, push,
    retrocycle, stringify, test, toString
*/

exports.decycle = function decycle(object) {
  'use strict';

  // Make a deep copy of an object or array, assuring that there is at most
  // one instance of each object or array in the resulting structure. The
  // duplicate references (which might be forming cycles) are replaced with
  // an object of the form
  //      {$ref: PATH}
  // where the PATH is a JSONPath string that locates the first occurance.
  // So,
  //      var a = [];
  //      a[0] = a;
  //      return JSON.stringify(JSON.decycle(a));
  // produces the string '[{"$ref":"$"}]'.

  // JSONPath is used to locate the unique object. $ indicates the top level of
  // the object or array. [NUMBER] or [STRING] indicates a child member or
  // property.

  var objects = [],   // Keep a reference to each unique object or array
      paths = [];     // Keep the path to each unique object or array

  return (function derez(value, path) {

    // The derez recurses through the object, producing the deep copy.

    var i,          // The loop counter
      name,       // Property name
      nu;         // The new object or array

    // typeof null === 'object', so go on if this value is really an object but not
    // one of the weird builtin objects.

    if (value instanceof Date) {
      return {$ref: {$date: value}};
    }
    if (typeof value === 'object' && value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Number)  &&
      !(value instanceof RegExp)  &&
      !(value instanceof String)) {

        // If the value is an object or array, look to see if we have already
        // encountered it. If so, return a $ref/path object. This is a hard way,
        // linear search that will get slower as the number of unique objects grows.

      for (i = 0; i < objects.length; i += 1) {
          if (objects[i] === value) {
              return {$ref: paths[i]};
          }
      }

      // Otherwise, accumulate the unique value and its path.

      objects.push(value);
      paths.push(path || '$');

      // If it is an array, replicate the array.

      if (Object.prototype.toString.apply(value) === '[object Array]') {
          nu = [];
          for (i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']');
          }
      } else {

        // If it is an object, replicate the object.

        nu = {};
        for (name in value) {
          if (Object.prototype.hasOwnProperty.call(value, name)) {
            nu[name] = derez(value[name],
              path + '[' + JSON.stringify(name) + ']');
          }
        }
      }
      return nu;
    }
    return value;
  }(object, ''));
};


exports.retrocycle = function retrocycle($) {
  'use strict';

  // Restore an object that was reduced by decycle. Members whose values are
  // objects of the form
  //      {$ref: PATH}
  // are replaced with references to the value found by the PATH. This will
  // restore cycles. The object will be mutated.

  // So,
  //      var s = '[{"$ref":"$"}]';
  //      return JSON.retrocycle(JSON.parse(s));
  // produces an array containing a single element which is the array itself.


  (function rez(value) {

    // The rez function walks recursively through the object looking for $ref
    // properties. When it finds one that has a value that is a path, then it
    // replaces the $ref object with a reference to the value that is found by
    // the path.

    var i, item, name, path;

    if (value && typeof value === 'object') {
      if (Object.prototype.toString.apply(value) === '[object Array]') {
        for (i = 0; i < value.length; i += 1) {
          item = value[i];
          if (item && typeof item === 'object') {
            path = item.$ref;
            if (typeof path === 'string') {
              value[i] = pathGetter($, path);
            } else if (typeof path === 'object' && path.$date) {
              value[name] = new Date(path.$date);
            } else {
              rez(item);
            }
          }
        }
      } else {
        for (name in value) {
          if (typeof value[name] === 'object') {
            item = value[name];
            if (item) {
              path = item.$ref;
              if (typeof path === 'string') {
                value[name] = pathGetter($, path);
              } else if (typeof path === 'object' && path.$date) {
                value[name] = new Date(path.$date);
              } else {
                rez(item);
              }
            }
          }
        }
      }
    }
  }($));
  return $;
};
