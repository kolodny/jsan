var jsan = require('../');
var decycle = require('../lib/cycle').decycle;

var CircularJSON = require('circular-json');
var stringify = require('json-stringify-safe');

var decycledGlobal = decycle(global, {});

function suite(name, obj, iterations) {
  console.log(name + ' at ' + iterations + ' iterations');
  test('jsan', iterations, jsan.stringify, obj);
  test('CircularJSON', iterations, CircularJSON.stringify, obj);
  test('json-stringify-safe', iterations, stringify, obj);
  console.log();
};

function test(name, iterations, fn, obj) {
  var ms = time(function() {
    for (var i = 0; i < iterations; i++) {
      fn(obj);
    }
  });
  console.log('    ' + name + ' took ' + ms);
}

function time(fn) {
  var start = new Date();
  fn();
  return new Date() - start;
}


suite('global', global, 1000);
suite('decycledGlobal', decycledGlobal, 1000);
suite('empty object', {}, 1000000);
suite('empty array', [], 1000000);

suite('small object', {x: 1, y: 2, z: 3}, 100000);
var obj = {x: 1, y: 2, z: 3};
obj.self = obj;
suite('self referencing small object', {x: 1, y: 2, z: 3}, 100000);

suite('small array', ['x', 'y', 123, 'z'], 100000);
var arr = ['x', 'y', 123, 'z'];
arr.push(arr);
suite('self referencing small array', ['x', 'y', 123, 'z'], 100000);

suite('string', 'this" is \' a test\t\n', 1000000);
suite('number', 1234, 1000000);
suite('null', null, 1000000);
