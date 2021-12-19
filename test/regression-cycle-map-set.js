var assert = require('assert');
var { stringify } = require('..');

describe('issues/32', function() {
  it('works', function() {
    const carrier = {
      id: "Carrier 1",
      map: new Map()
    };
    
    const period = {
      id: "Period 1",
      carriers: new Set([carrier])
    };
    
    carrier.map.set(period, {});
    
    const result = stringify([carrier], undefined, null, true);
  });
});
