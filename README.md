#### Install
`$ npm install -g yawg`

then run it

`$ yawg`

```
aspect enabled
orleans over
expansion gem
drinks luxury
claim domain
sentence link
stationery dans
chronicles ppc
agency then
stock dominant
```


#### Options
`$ yawg -h`

```
yawg - Yet Another Word Generator

version: 1.1.0

Required parameters: (none)

Optional parameters:
--delimiter=' '     Delimiter between words
--minWords=2        Min number of words
--maxWords=4        Max number of words
--minLength=8       Min length of phrase
--maxLength=15      Max length of phrase
--minWordLength=2   Min word length
--maxWordLength=10  Max word length
--attempts=1e4      Max attempts per phrase
--greedy=false      Try to maximize phrase length
--count=10          Number of phrases to generate
    alias: -n
--help              Show this screen
    alias: -h
```

#### Copy to clipboard
`$ yawg -n 1 | clip` puts "prediction mat" in clipboard

#### Longer phrases
`$ yawg --minWords=4 --maxLength=40`

```
sip ntsc need file
shelter court head happens
cook trips world german
xbox length receiving notebook
british caroline mixing primary
antivirus berry daily big
shortcuts stunning message neon
vegetation defects antiques framed
invoice junk holland iron
ion ukraine soap beth
```

Without specifying a longer maxLength, you will typically run into failed attempts of generating phrases when it is not able to find 4 words to fit in the default maxLength of 15. You could also try increasing `attempts` to a larger value.

#### Node API
You can require this package in your NodeJS code and pass in the options as an
object argument.

Example:
```js
'use strict';

var yawg = require('yawg');

try {
    var password = yawg({
        minWords: 4,
        maxLength: 50,
        attempts: 100,
    });
    console.log('Password is ' + password);
} catch (err) {
    // handle error here
    // either a problem with the provided options
    // or a password couldn't be generated after the
    // given number of attempts
}
```
