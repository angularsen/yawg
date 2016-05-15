`$ yawg -h`

```
yawg - Yet Another Word Generator

version: 1.0.2

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

Without specifying a longer maxLength, you will typically run into an error generating passwords as it is not able to find 4 words to fit in the default 15 maxLength. You could try increasing `attempts` from 100 to a larger value.