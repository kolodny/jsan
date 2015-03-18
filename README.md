jsan
===

[![Build Status](https://travis-ci.org/kolodny/jsan.svg?branch=master)](https://travis-ci.org/kolodny/jsan)

### Usage

```js
var jsan = require('jsan');

var obj = {};
obj['self'] = obj;
var str = jsan.stringify(obj);
var obj2 = jsan.parse(str);
obj2 === obj2['self']; // true
```
