# re.js

[![npm](http://img.shields.io/npm/v/re.js.svg)](https://www.npmjs.com/package/re.js)
[![release](https://img.shields.io/github/release/onury/re.svg)](https://github.com/onury/re)
[![dependencies](https://david-dm.org/onury/re.svg)](https://david-dm.org/onury/re)
[![license](http://img.shields.io/npm/l/re.svg)](https://github.com/onury/re/blob/master/LICENSE)
[![maintained](https://img.shields.io/maintenance/yes/2019.svg)](https://github.com/onury/re/graphs/commit-activity)  

> © 2019, Onur Yıldırım ([@onury](https://github.com/onury)). MIT License.

### `RegExp` API for Humans!  

- Friendly API! e.g. `re(pattern).each(input, callback)`
- Universal module (Browser/Node/CommonJS/AMD)
- Small size. Only **1.5 KB** minified, gzipped.
- Well [documented][docs].

## Installation

Install via **NPM**:
```sh
npm i re.js
```
Install via **Bower**:
```sh
bower install re.js
```

## Usage
For all the features and details, please read the [**API reference**][docs].
```js
const re = require('re.js');
```

### `.each()`

```js
var input = 'Peter Piper picked a peck of pickled peppers.';

re(/p\w+/i).each(input, function (matches) {
    console.log(matches[0]);
});
```
Note that above example does not have a `g` flag (for global) in the `RegExp`. But logically; since you're calling `each()` it should search for all. So `re` automatically fixes it for you.

### `.eachRight()`
Iterate from last match to first.

```js
re(/p\w+/i).eachRight(input, function (matches, index) {
    if (matches[0] === 'peck') {
        console.log('exiting @', index); // —> exiting @ 3
        // return early, no more iterations..
        return false;
    }
});
```

### `.map()`

```js
var mapped = re(/p\w+/i).map(input, function (matches) {
    return matches[0];
});
console.log(mapped);
// —> ["Peter", "Piper", "picked", "peck", "pickled", "peppers"]
```

### `.all()`

```js
re(/p\w+/i).all(input);
// —> [Array, Array, Array, Array, Array, Array]
```

### `.match()`

```js
re(/p\w+/i).match(input);
// —> ["Peter", "Piper", "picked", "peck", "pickled", "peppers"]
```

### `.exec().next()`

```js
re(/p\w+/i)
    .exec(input)
    .next(function (matches, index) {
        console.log(index + ':', matches[0]); // —> 0: "Peter"
    })
    .next(function (matches, index) {
        console.log(index, ':', matches[0]); // —> 1: "Piper"
    })
    ..
```

### `.test()`
for convenience...
```js
re(/p\w+/i).test(input); // —> true
```

### Match Indices

```js
re(/p\w+/i).first(input)[0];        // —> "Peter"
re(/p\w+/i).firstIndex(input);      // —> 0
re(/p\w+/i).first(input).index;     // —> 0

re(/none/).first(input);            // —> null
re(/none/).firstIndex(input);       // —> -1
re(/none/).first(input).index;      // —> Error

re(/p\w+/i).last(input)[0];         // —> "peppers"
re(/p\w+/i).lastIndex(input);       // —> 37
re(/p\w+/i).last(input).index;      // —> 37

re(/p\w+/i).nth(input, 3)[0];       // —> "picked"

re(/p\w+/i).indices(input);         // —> [ 0, 6, 12, 21, 29, 37 ]
```

## Documentation

See [**all methods and features**][docs].

[docs]:https://onury.github.io/re/?api=re

## Change Log

- v**1.1.0**
    + `.eachRight()` callback parameter `index` is now reversed. (last iteration index will be `0`.)
    + Added `.eachInverse()` method for iterating over non-matched blocks. #experimental
    + Added extra argument to callbacks for convenience: `charIndex` (same as `matches.index`).

- v**1.0.0**
    + Initial release.

## License

MIT.
