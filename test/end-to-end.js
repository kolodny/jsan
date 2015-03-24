var assert = require('assert');
var jsan = require('rek')('');

describe('jsan', function() {


  it('can round trip a regular object', function() {
    var obj1 = {a: {b: {c: {d: 1}}}};
    var obj2 = jsan.parse(jsan.stringify(obj1));
    assert.deepEqual(obj1, obj2);
  });

  it('can round trip a circular object', function() {
    var obj1 = {};
    obj1['self'] = obj1;
    var obj2 = jsan.parse(jsan.stringify(obj1));
    assert(obj2['self'] === obj2);
  });

  it('can round trip a self referencing objects', function() {
    var obj1 = {};
    var subObj = {};
    obj1.a = subObj;
    obj1.b = subObj;
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert(obj2.a === obj2.b);
  });

  it('can round trip dates', function() {
    var obj1 = { now: new Date() };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert(obj2.now instanceof Date);
  });

  it('can round trip a complex object', function() {
    var obj1 = {
      sub1: {},
      now: new Date()
    };
    obj1['self'] = obj1;
    obj1.sub2 = obj1.sub1;
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert(obj2.now instanceof Date);
    assert(obj2.sub1 === obj2.sub2);
    assert(obj2['self'] === obj2);
  });


});
