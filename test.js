'use strict';

var assert = require('assert');
var yawg = require('./lib');

for (let i=0; i<1000; i++) {
    const phrase = yawg({
        minLength: 15,
        maxLength: 40,
        minWords: 3,
        maxWords: 5
    });

    // TODO Should add a lot more test cases here and tighter constraints, but.. meh!
    assert.equal(phrase.length >= 15, true, 'Password minimum length not reached.');
    assert.equal(phrase.length <= 40, true, 'Password maximum length exceeded.');

    const words = phrase.split(' ');
    assert.equal(words.length >= 3, true, 'Fewer words than minWords.');
    assert.equal(words.length <= 5, true, 'More words than maxWords.');
}

