jsan
===

[![Build Status](https://travis-ci.org/kolodny/jsan.svg?branch=master)](https://travis-ci.org/kolodny/jsan)

### JavaScript "All The Things" Notation  
![JSAN](https://i.imgur.com/IdKDIB6.png)

Easily stringify and parse any object including objects with circular references, using the familar `parse` and `stringify` methods.

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

Now with 100% less `eval`!

#### Note

This ulitilty has been heavily optimized and performs as well as the native `JSON.parse` and `JSON.stringify`. It doesn't by default handle self references (non-circular) when stringifing but you can force it to check for that by passing in `true` as a forth arg:

```js
var obj = {};
var subObj = {};
obj.a = subObj;
obj.b = subObj;
var str1 = jsan.stringify(obj) // '{"a":{},"b":{}}'
var str2 = jsan.stringify(obj, null, null, true) // '{"a":{},"b":{"$ref":"[\\"a\\"]"}}'
```
