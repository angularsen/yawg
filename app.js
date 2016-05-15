#!/usr/bin/env node --harmony_destructuring

'use strict';


var parseArgs = require('minimist');
var fs = require('fs');
var debug = require('debug')('pwer');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var pjson = require('./package.json');
var version = pjson.version;

let dictionaryFilePath = path.join(__dirname, './dictionary/first20hours/2014-12-17-google-10000-english-usa.txt');

var argv = parseArgs(process.argv.slice(2),
{
    string: [ 'delimiter' ],
    boolean: true, // treat all '--myArg' args without values as boolean args
    alias: {n: "count", h: "help" },
    default: { delimiter: ' ', minWords: 2, maxWords: 4, minLength: 8, maxLength: 15, minWordLength: 3, maxWordLength: 10, attempts: 100, greedy: false, n: 10, h: false }
});

var { minWords, maxWords, minLength, maxLength, minWordLength, maxWordLength, count, help } = argv;
if (help) {
        console.log(`yawg - Yet Another Word Generator

version: ${version}

Required parameters: (none)

Optional parameters:
--delimiter=' '     Delimiter between words
--minWords=2        Min number of words
--maxWords=4        Max number of words
--minLength=8       Min length of phrase
--maxLength=15      Max length of phrase
--minWordLength=3   Min word length
--maxWordLength=10  Max word length
--attempts=100      Max attempts per phrase
--greedy=false      Try to maximize phrase length
--count=10          Number of phrases to generate
    alias: -n       
--help              Show this screen
    alias: -h       
`);
    return;
}

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

debug(util.inspect(argv));

var Words = [];
debug('Start reading word list.');
require('readline')
    .createInterface({
        input: fs.createReadStream(dictionaryFilePath),
        terminal: false
    })
    .on('line', (line) => Words.push(line))
    .on('close',
    () => {
        debug('Done reading word list.');

        for (let i = 0; i < count; i++) {
            const phrase = getPassword();
            console.log(`${phrase}`);
        }
    });

function getPassword() {
    const currentWords = [];
    var { delimiter, minWords, maxWords, minLength, maxLength, minWordLength, maxWordLength, attempts, greedy } = argv;

    // Up to N attempts at generating a phrase, to avoid infinite loop
    for (let i = 0; i < attempts; i++) {
        const randomLineIndex = randomInt(0, Words.length);
        const word = Words[randomLineIndex];

        const attemptedWords = currentWords.concat(word);

        // substring to trim leading delimiter
        const attemptedPassword = _.reduce(attemptedWords,
                (memo, currentWord) => memo + delimiter + currentWord,
                "")
            .substring(delimiter.length); 

        const length = attemptedPassword.length;
        const messagePrefix = `Attempt #${i + 1}: ${attemptedPassword} (${length})`;
        if (word.length < minWordLength) {
            debug(`${messagePrefix}: Word too short, ${word.length} of ${minWordLength}`);
        } else if (word.length > maxWordLength) {
            debug(`${messagePrefix}: Word too long, ${word.length} of ${minWordLength}`);
        } else if (length > maxLength) {
            debug(`${messagePrefix}: Password too long, ${length} of ${maxLength}`);
        } else if (attemptedWords.length > maxWords) {
            debug(`${messagePrefix}: Too many words, ${attemptedWords.length} of ${maxWords}`);
        } else if (length < minLength) {
            debug(`${messagePrefix}: Word OK, but phrase too short, ${length} of ${minLength}`);
            currentWords.push(word);
        } else if (attemptedWords.length < minWords) {
            debug(`${messagePrefix}: Word OK, but too few words, ${attemptedWords.length} of ${minWords}`);
            currentWords.push(word);
        } else if (greedy) {
            debug(`${messagePrefix}: Password OK, but greedy wants more.`);
            currentWords.push(word);
        } else {
            debug(`${messagePrefix}: Password OK!`);
            return attemptedPassword;
        }
    }

    throw new Error('Failed to generate phrase.');
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}