#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const titleColor = chalk.blue;
const defArgColor = chalk.redBright;
const paramColor = chalk.cyan;
const descColor = chalk.gray;

const parseArgs = require('minimist');
const fs = require('fs');
const debug = require('debug')('yawg');
const _ = require('underscore');
const util = require('util');
const path = require('path');
const pjson = require('./package.json');
const version = pjson.version;

const yawg = require('./lib');

const defaultCount = 1;
const argv = parseArgs(process.argv.slice(2), {
    string: ['delimiter'],
    boolean: true, // treat all '--myArg' args without values as boolean args
    alias: { n: "count", h: "help" },
    default: {
        ...yawg.defaultOpts,
        n: defaultCount,
        h: false
    },
});

const def = yawg.defaultOpts;
const count = argv.count;
const help = argv.help;

if (help) {
    const helpText = `${titleColor('yawg - Yet Another Word Generator')}

version: ${version}

Required parameters: (none)

Optional parameters:
${paramColor('--delimiter')}=${defArgColor(`'${def.delimiter}'`)}     ${descColor("Delimiter between words")}
${paramColor('--minLength')}=${defArgColor(def.minLength)}       ${descColor("Min length of phrase")}
${paramColor('--maxLength')}=${defArgColor(def.maxLength)}      ${descColor("Max length of phrase")}
${paramColor('--minWords')}=${defArgColor(def.minWords)}        ${descColor("Min number of words")}
${paramColor('--maxWords')}=${defArgColor(def.maxWords)}        ${descColor("Max number of words")}
${paramColor('--minWordLength')}=${defArgColor(def.minWordLength)}   ${descColor("Min word length")}
${paramColor('--maxWordLength')}=${defArgColor(def.maxWordLength)}  ${descColor("Max word length")}
${paramColor('--attempts')}=${defArgColor(def.attempts)}      ${descColor("Max attempts per phrase")}
${paramColor('--count')}=${defArgColor(defaultCount)}          ${descColor("Number of phrases to generate")}
    alias: -n
${paramColor('--help')}              ${descColor("Show this screen")}
    alias: -h
`;

    console.log(helpText);
    return;
}

debug(util.inspect(argv));

yawg.validateOptions(argv);

let failCount = 0;
for (let i = 0; i < count; i++) {
    try {
        console.log(chalk.blue(yawg(argv)));
    } catch (e) {
        failCount++;
    }
}

if (failCount > 0) {
    console.log('');
    console.warn(chalk.red(`Failed to generate ${failCount} of ${count} phrases.`));
}
