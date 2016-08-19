'use strict';

var fs = require('fs');
var debug = require('debug')('pwer');
var _ = require('underscore');
var util = require('util');
var path = require('path');

var defaults = {
    delimiter: ' ',
    minWords: 2,
    maxWords: 4,
    minLength: 8,
    maxLength: 15,
    minWordLength: 2,
    maxWordLength: 10,
    attempts: 1e4,
    greedy: false,
    n: 10,
    h: false,
};

// Note, this reads a dictionary file with one word on each line into
// an array. It's not very memory efficient. It would be best to use
// this package in command-line scripts or a stand-alone service
// so it doesn't bloat your main application.
var dictionaryFilePath = path.join(
    __dirname, 'dictionary', 'first20hours',
    '2014-12-17-google-10000-english-usa.txt'
);
var words = fs.readFileSync(dictionaryFilePath).toString().split("\n");

function validateOptions(options) {
  var minWords = options.minWords;
  var minLength = options.minLength;
  var minWordLength = options.minWordLength;
  var maxWords = options.maxWords;
  var maxLength = options.maxLength;
  var maxWordLength = options.maxWordLength;

  if (minWords < 1)
      throw new Error('minWords must be greater than zero.');
  if (minLength < 1)
      throw new Error('minWords must be greater than zero.');
  if (minWordLength < 1)
      throw new Error('minWordLength must be greater than zero.');

  if (maxWords < minWords)
      throw new Error('maxWords must be greater than minWords.');
  if (maxLength < minLength)
      throw new Error('maxLength must be greater than minLength.');
  if (maxWordLength < minWordLength)
      throw new Error('maxWordLength must be greater than minWordLength.');

  if (maxWordLength > maxLength)
      throw new Error('maxWordLength should not be greater than maxLength.');
  if (minWordLength > maxLength)
      throw new Error('minWordLength should not be greater than maxLength.');
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function yawg(options, cb) {
    var params = {};
    var currentWords = [];
    var i;
    var randomLineIndex;
    var word;
    var attemptedWords;
    var attemptedPassword;
    var length;
    var messagePrefix;
    var delimiter;
    var minWords;
    var maxWords;
    var minLength;
    var maxLength;
    var minWordLength;
    var maxWordLength;
    var attempts;
    var greedy;

    _.extendOwn(params, defaults, options);

    delimiter = params.delimiter;
    minWords = params.minWords;
    maxWords = params.maxWords;
    minLength = params.minLength;
    maxLength = params.maxLength;
    minWordLength = params.minWordLength;
    maxWordLength = params.maxWordLength;
    attempts = params.attempts;
    greedy = params.greedy;

    // Up to N attempts at generating a phrase, to avoid infinite loop
    for (i = 0; i < attempts; i++) {
        randomLineIndex = randomInt(0, words.length);
        word = words[randomLineIndex];

        attemptedWords = currentWords.concat(word);
        attemptedPassword = attemptedWords.join(delimiter);
        length = attemptedPassword.length;
        messagePrefix = 'Attempt #' + (i + 1) + ': ' + attemptedPassword + ' (' + length + ')';

        if (word.length < minWordLength) {
            debug(messagePrefix + ': Word too short, ' + word.length + ' of ' + minWordLength);
        } else if (word.length > maxWordLength) {
            debug(messagePrefix + ': Word too long, ' + word.length + ' of ' + minWordLength);
        } else if (length > maxLength) {
            debug(messagePrefix + ': Password too long, ' + length + ' of ' + maxLength);
        } else if (attemptedWords.length > maxWords) {
            debug(messagePrefix + ': Too many words, ' + attemptedWords.length + ' of ' + maxWords);
        } else if (length < minLength) {
            debug(messagePrefix + ': Word OK, but phrase too short, ' + length + ' of ' + minLength);
            currentWords.push(word);
        } else if (attemptedWords.length < minWords) {
            debug(messagePrefix + ': Word OK, but too few words, ' + attemptedWords.length + ' of ' + minWords);
            currentWords.push(word);
        } else if (greedy) {
            debug(messagePrefix + ': Password OK, but greedy wants more.');
            currentWords.push(word);
        } else {
            debug(messagePrefix + ': Password OK!');
            return attemptedPassword;
        }
    }
    throw new Error('Failed to generate phrase.');
}

yawg.validateOptions = validateOptions;

exports = module.exports = yawg;
