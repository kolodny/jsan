jsan
===

[![Build Status](https://travis-ci.org/kolodny/jsan.svg?branch=master)](https://travis-ci.org/kolodny/jsan)

### Usage

```js
var jsan = require('jsan');

var obj = {};
obj['self'] = obj;
obj['sub'] = {};
obj['sub']['subSelf'] = obj['sub'];
var str = jsan.stringify(obj);
str === '{"self":{"$ref":"$"},"sub":{"subSelf":{"$ref":"[\\"sub\\"]"}}}'; // true
var obj2 = jsan.parse(str);
obj2 === obj2['self']; // true
obj2['sub']['subSelf'] === obj2['sub']; // true
```
