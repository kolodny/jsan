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

    it('works on objects that will get encoded with \\uXXXX', function() {
      var obj = {"\u017d\u010d":{},"kraj":"\u017du\u017e"};
      obj["\u017d\u010d"]["\u017d\u010d"] = obj["\u017d\u010d"];
      assert.equal(jsan.stringify(obj), '{"\u017d\u010d":{"\u017d\u010d":{"$ref":"$[\\\"\u017d\u010d\\\"]"}},"kraj":"Žuž"}');
    });

    it('works on circular arrays', function() {
      var obj = [];
      obj[0] = [];
      obj[0][0] = obj[0];
      assert.equal(jsan.stringify(obj), '[[{"$ref":"$[0]"}]]');
    });

  });


  describe('has a parse method', function() {
    it('behaves the same as JSON.parse for valid json strings', function() {
      var str = '{"a":1,"b":"string","c":[2,3],"d":null}';
      assert.deepEqual(JSON.parse(str), jsan.parse(str));
    });

    it('works on object strings with a circular dereferences', function() {
      var str = '{"a":1,"b":"string","c":[2,3],"d":null,"self":{"$ref":"$"}}';
      var obj = jsan.parse(str);
      assert(obj['self'] === obj);
    });

    it('works on objects encoded with \\uXXXX', function() {
      var str = '{"\u017d\u010d":{"\u017d\u010d":{"$ref":"$[\\\"\\u017d\\u010d\\\"]"}},"kraj":"Žuž"}';
      var obj = jsan.parse(str);
      assert(obj["\u017d\u010d"]["\u017d\u010d"] === obj["\u017d\u010d"]);
    });

    it('works on array strings with circular dereferences', function() {
      var str = '[[{"$ref":"$[0]"}]]';
      var arr = jsan.parse(str);
      assert(arr[0][0] === arr[0]);
    });
  });


});
