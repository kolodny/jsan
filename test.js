var assert = require('assert');
var jsan = require('rek')('');

describe('jsan', function() {
  describe('has a stringify method', function() {
    it('behaves the same as JSON.stringify for jsonable objects', function() {
      var obj = {
        a: 1,
        b: 'string',
        c: [2,3],
        d: null
      };
      assert.equal(JSON.stringify(obj), jsan.stringify(obj));
    });

    it('works on objects with circular references', function() {
      var obj = {
        a: 1,
        b: 'string',
        c: [2,3],
        d: null
      };
      obj['self'] = obj;
      assert.equal(jsan.stringify(obj), '{"a":1,"b":"string","c":[2,3],"d":null,"self":{"$ref":"$"}}');
    });

  });


  describe('has a parse method', function() {
    it('behaves the same as JSON.parse for valid json strings', function() {
      var str = '{"a":1,"b":"string","c":[2,3],"d":null}';
      assert.deepEqual(JSON.parse(str), jsan.parse(str));
    });

    it('works on strings with a circular dereference', function() {
      var str = '{"a":1,"b":"string","c":[2,3],"d":null,"self":{"$ref":"$"}}';
      var obj = jsan.parse(str);
      assert(obj['self'] === obj);
    });
  });


});
