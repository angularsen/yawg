'use strict';

const dictionaryFilePath = './dictionary/first20hours/2014-12-17-google-10000-english-usa.txt';

var parseArgs = require('minimist');
var fs = require('fs');
var debug = require('debug')('pwer');
var _ = require('underscore');
var util = require('util');

var argv = parseArgs(process.argv.slice(2),
{
    string: [ 'delimiter' ],
    boolean: true, // treat all '--myArg' args without values as boolean args
    alias: {n: "count"},
    default: { delimiter: ' ', minWords: 2, minLength: 8, maxLength: 15, minWordLength: 2, maxWordLength: 10, attempts: 100, greedy: false, n: 10 }
});

var { minWords, maxWords, minLength, maxLength, minWordLength, maxWordLength, count } = argv;
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
            const password = getPassword();
            console.log(`${password}`);
        }
    });

function getPassword() {
    const currentWords = [];
    var { delimiter, minWords, maxWords, minLength, maxLength, minWordLength, maxWordLength, attempts, greedy } = argv;

    // Up to N attempts at generating a password, to avoid infinite loop
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
            debug(`${messagePrefix}: Word OK, but password too short, ${length} of ${minLength}`);
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

    throw new Error('Failed to generate password.');
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}