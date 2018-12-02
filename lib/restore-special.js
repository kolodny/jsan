var jsan = require('./');

exports.withMap = function withMap(rest) {
    return new Map(jsan.parse(rest));
};

exports.withSet = function withSet(rest) {
    return new Set(jsan.parse(rest));
};
