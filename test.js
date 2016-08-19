'use strict';

var assert = require('assert');
var yawg = require('./lib');

var password = yawg({
    minLength: 8,
    maxLength: 15,
});
assert.equal(password && password.length >= 8, true, 'Password minimum length not reached.');
assert.equal(password.length <= 15, true, 'Password maximum length exceeded.');
