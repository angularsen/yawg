### Install
Install `yawg` globally with [NPM package manager](https://docs.npmjs.com/cli/npm) included with [NodeJS](https://nodejs.org/en/):
```
$ npm install -g yawg        
```

Alternatively with [Yarn package manager](https://yarnpkg.com/):
```
$ yarn global add yawg
```

Then run it:

```
$ yawg
register office windows
```

### Parameters
```
$ yawg -h
yawg - Yet Another Word Generator

version: 1.2.3

Required parameters: (none)

Optional parameters:
--delimiter=' '     Delimiter between words
--minLength=12      Min length of phrase
--maxLength=25      Max length of phrase
--minWords=3        Min number of words
--maxWords=5        Max number of words
--minWordLength=1   Min word length
--maxWordLength=8   Max word length
--attempts=10000    Max attempts per phrase
--count=1           Number of phrases to generate
    alias: -n
--help              Show this screen
    alias: -h
```

### Examples
#### Copy phrase to clipboard
`$ yawg | clip`

#### Multiple phrases
```
$ yawg -n 10
dans mainly fly tray luke
yen craft marco ill jobs
ran situated bouquet
toys que wrist achieve
bless worry filme craft
justin shame toronto
trader reset dui gen lead
str disks antigua nest
marvel enables moms
trusted cleared unit
```

#### Short words only
```
$ yawg -n3 --maxWordLength=4
fork my core
mat fair hong
bras arm foul
```

#### Long phrases
```
$ yawg -n3 --minLength=30
chose filling gotten phys incl
overseas vip intake bonds kurt
reader cock staff directed toe
```

### Node API
You can require this package in your NodeJS code and pass in the options as an object argument.

Example:
```js
'use strict';

var yawg = require('yawg');

try {
    var phrase = yawg({
        minWords: 4,
        maxLength: 50,
        attempts: 100,
    });
    console.log('Phrase is: ' + phrase);
} catch (err) {
    // Not able to produce a phrase that mathed the constraints of the parameters.
    // Example: --maxLength=10 --minWords=5 --minWordLength=3  # Can only generate phrase of minimum length 5*13=15
}
```

### Troubleshooting
1. Sometimes Yarn on Windows does not properly configure the PATH environment variable. [Make sure PATH is properly set up](https://github.com/yarnpkg/yarn/issues/1648).
    * Find the global yarn bin path: `$ yarn global bin   # Ex: C:\Users\Andreas\AppData\Local\Yarn\bin`
    * Append path to PATH env variable

