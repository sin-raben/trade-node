'use strict';
var co = require('co');
console.log('1', 1);
co(function * () {
    yield Promise.resolve(true);
    var result = yield Promise.resolve(true);
    return 1;
}).then(function(value) {
    console.log(value);
}, function(err) {
    console.error(err.stack);
});
