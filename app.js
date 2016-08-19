#!/usr/bin/env node

'use strict';

var parseArgs = require('minimist');
var fs = require('fs');
var debug = require('debug')('pwer');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var pjson = require('./package.json');
var version = pjson.version;

var yawg = require('./lib');

var argv = parseArgs(process.argv.slice(2), {
    string: [ 'delimiter' ],
    boolean: true, // treat all '--myArg' args without values as boolean args
    alias: {n: "count", h: "help" },
    default: {
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
        h: false
    }
});

var count = argv.count;
var help = argv.help;

var helpText = 'yawg - Yet Another Word Generator\
\
version: ' + version + '\
\
Required parameters: (none)\
\
Optional parameters:\
--delimiter=\' \'     Delimiter between words\
--minWords=2        Min number of words\
--maxWords=4        Max number of words\
--minLength=8       Min length of phrase\
--maxLength=15      Max length of phrase\
--minWordLength=2   Min word length\
--maxWordLength=10  Max word length\
--attempts=1e4      Max attempts per phrase\
--greedy=false      Try to maximize phrase length\
--count=10          Number of phrases to generate\
alias: -n\
--help              Show this screen\
alias: -h\
';

if (help) {
    console.log(helpText);
    return;
}

debug(util.inspect(argv));

yawg.validateOptions(argv);

var i;
var phrase;
for (i = 0; i < count; i++) {
    try {
        phrase = yawg(argv);
    } catch(e) {
        phrase = null;
    }
    console.log(phrase || "(failed)");
}
