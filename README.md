# re.js

> © 2016, Onur Yıldırım (@onury). MIT License.  

### `RegExp` API for Humans!  

- `.match()`, `.exec()`, `.search()`, `.test()`...  
Which method belongs to what prototype? `RegExp` vs `String`..
- Why do you "sometimes" run into infinite loops with `.exec()` in a `while` condition?
- When should you set the `g` (global) flag?
- What is `.lastIndex` really for? When should you set it?
- Is there an easy way to get all the matches and/or indices at once via `RegExp`?
- What?! I have to call `.exec()` repeatedly?

EcmaScript Regular Expressions specification is powerful but a bit confusing, right?

For example, if you place regular expression literal or `RegExp` constructor within a `while` condition, you'll hit an infinite loop if there is a match! (Because the `RegExp` instance is re-initiated every time; which resets `lastIndex` to `0`).

Or if you forget the `global` flag for a `RegExp#exec()` call in a `while` condition; you'll again, hit an inifite loop!

..

`re` will save you from all the weirdness!  

## Features

- Friendly API!
- Supports both browser and Node
- Universal module
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

```js
const re = require('re.js');
```

For all the features and details, please read the [API reference][docs].

### `.each()`

```js
var input = 'Peter Piper picked a peck of pickled peppers.';

re(/p\w+/i).each(input, function (matches) {
    console.log(matches[0]); // logs words starting with a "p"
});
```
Note that above example does not have a `g` flag (for global) in the `RegExp`. But logically; since you're calling `each()` it should search for all. So `re` automatically fixes it for you.

### `.eachRight()`
Iterate from last match to first.

```js
re(/p\w+/i).eachRight(input, function (matches, index) {
    if (matches[0] === 'peck') {
        console.log('exiting @', index); // —> exiting @ 2
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

```js
re(/p\w+/i).test(input); // —> true
```

### Match Index

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
See [all methods and features][docs].

[docs]:https://onury.github.io/re/?api=re


## License

MIT.
