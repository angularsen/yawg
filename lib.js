'use strict';

const fs = require('fs');
const debug = require('debug')('yawg');
const _ = require('underscore');
const path = require('path');

const defaultOpts = {
  delimiter: ' ',
  minLength: 12,
  maxLength: 25,
  minWords: 3,
  maxWords: 5,
  minWordLength: 1,
  maxWordLength: 8,
  attempts: 1e4,
};

// Note, this reads a dictionary file with one word on each line into
// an array. It's not very memory efficient. It would be best to use
// this package in command-line scripts or a stand-alone service
// so it doesn't bloat your main application.
const dictionaryFilePath = path.join(__dirname, 'dictionary/first20hours/2014-12-17-google-10000-english-usa.txt');
const words = fs.readFileSync(dictionaryFilePath).toString()/*.replace("\r\n", "\n")*/.split("\n");

function isString(obj) {
  return (typeof obj === 'string' || obj instanceof String);
}

function ensureInt(obj, paramName) {
  if (!Number.isInteger(obj)) throw new Error(`Parameter [${paramName}] should be an integer, was [${obj}] of type [${typeof (obj)}].`)
}

function ensureString(obj, paramName) {
  if (!isString(obj)) throw new Error(`Parameter [${paramName}] should be a string, was [${obj}] of type [${typeof (obj)}].`)
}

function validateOptions(opts) {
  const { delimiter, minWords, minLength, minWordLength, attempts } = opts;

  ensureString(delimiter, 'delimiter');
  ensureInt(minWords, 'minWords');
  ensureInt(minLength, 'minLength');
  ensureInt(minWordLength, 'minWordLength');

  // Not const, these may be manipulated below
  ensureInt(opts.maxWords, 'maxWords');
  ensureInt(opts.maxLength, 'maxLength');
  ensureInt(opts.maxWordLength, 'maxWordLength');

  if (minWords < 1) throw new Error('minWords must be greater than zero.');
  if (minLength < 1) throw new Error('minWords must be greater than zero.');
  if (minWordLength < 1) throw new Error('minWordLength must be greater than zero.');

  if (opts.maxWordLength > opts.maxLength) throw new Error('maxWordLength should not be greater than maxLength.');
  if (opts.minWordLength * opts.minWords > opts.maxLength) throw new Error(`minWordLength[${opts.minWordLength}] times minWords[${opts.minWords}] will always produce longer phrases than maxLength[${opts.maxLength}].`);

  if (opts.maxWords < minWords) { debug('maxWords less than minWords, setting equal to minWords'); opts.maxWords = minWords; }
  if (opts.maxLength < minLength) { debug('maxLength less than minLength, setting equal to minLength'); opts.maxLength = minLength; }
  if (opts.maxWordLength < minWordLength) { debug('mmaxWordLength less than minWordLength, setting equal to minWordLength'); opts.maxWordLength = minWordLength; }
}

function randomInt(lowInclusive, highExclusive) {
  return Math.floor(Math.random() * (highExclusive - lowInclusive) + lowInclusive);
}

function yawg(opts) {
  const opts2 = { ...{}, ...defaultOpts, ...opts };
  const { delimiter, minWords, maxWords, minLength, maxLength, minWordLength, maxWordLength, attempts } = opts2;
  const randomWordCount = randomInt(minWords, maxWords + 1)
  const candidateWordsStartIdx = words.findIndex(w => w.length >= minWordLength);
  const candidateWordsEndIdx = words.findIndex(w => w.length > maxWordLength) - 1;

  debug(`startIdx: ${candidateWordsStartIdx} endIdx: ${candidateWordsEndIdx}`)

  const randomWord = () => {
    const idx = randomInt(candidateWordsStartIdx, candidateWordsEndIdx + 1);
    return words[idx];
  }

  // Up to N attempts at generating a phrase, to avoid infinite loop
  for (let i = 0; i < attempts; i++) {
    const chosenWords = _.times(randomWordCount, randomWord);
    const phrase = chosenWords.join(delimiter);
    const messagePrefix = `Attempt #${(i + 1)}: phrase[${phrase}]`;

    if (phrase.length < minLength) {
      debug(`${messagePrefix}: Phrase too short.`);
    }
    else if (phrase.length > maxLength) {
      debug(`${messagePrefix}: Phrase too long.`);
    } else {
      debug(`${messagePrefix}: OK!`);
      return phrase;
    }
  }
  throw new Error('Failed to generate phrase within constraints.');
}

yawg.validateOptions = validateOptions;
yawg.defaultOpts = defaultOpts

exports = module.exports = yawg;
