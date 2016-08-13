'use strict';

/**
 *  re.js — RegExp API for Humans!
 *  @license MIT
 *  @copyright 2016, Onur Yıldırım (onur@cutepilot.com)
 */

// --------------------------
// HELPER METHODS
// --------------------------

/**
 *  Escapes regular expression characters within the given string.
 *  @private
 */
function _escapeRegExp(pattern) {
    return pattern.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 *  Checks whether the given object is a `RegExp`.
 *  @private
 */
function _isRegExp(object) {
    return Object.prototype.toString.call(object) === '[object RegExp]';
}

/**
 *  Gets the current flags from a `RegExp` instance.
 *  @private
 */
function _getRegExpFlags(regexp) {
    return regexp.toString().match(/[gimu]*$/)[0] || '';
}

/**
 *  Ensures that a `RegExp` instance has the given flag(s).
 *  @private
 */
function _addFlags(regexp, flags) {
    flags = _uniqChars(flags + _getRegExpFlags(regexp));
    return new RegExp(regexp.source, flags);
}

/**
 *  Clones the given `RegExp` object.
 *  @private
 */
function _cloneRegExp(regexp) {
    return new RegExp(regexp.source, _getRegExpFlags(regexp));
}

/**
 *  Removes duplicate characters from the given string.
 *  @private
 */
function _uniqChars(str) {
    // we're safe to use .split here since we don't have unicode chars in 'gimu'.
    // http://stackoverflow.com/a/38901550/112731
    let arr = str.split('');
    return arr.filter((value, index, list) => {
        return list.indexOf(value) === index;
    }).join('');
}

// --------------------------
// CLASS: Exec
// --------------------------

/**
 *  Internal `Exec` class used specifically for `re().exec()` method.
 *  @protected
 *  @inner
 *  @memberof! re
 */
class Exec {

    /**
     *  Initiates a new instance of `Exec` class.
     *  @private
     *
     *  @param {RegExp} regexp - RegExp instance.
     *  @param {String} input - Source input string.
     */
    constructor(regexp, input) {
        this.regexp = regexp;
        this.input = input;
        // this is used to store the .exec() call count/index
        this.nextIndex = 0;
    }

    /**
     *  Calls `RegExp#exec()` method once, for the current input string.
     *  @private
     *
     *  @param {Function} callback
     *  @returns {Exec} - Returns the current `Exec` instance (for
     *  chainability and) so that `.next()` can be called repeatedly.
     */
    next(callback) {
        if (!this.regexp.global) {
            this.regexp = _addFlags(this.regexp, 'g');
        }
        let matches = this.regexp.exec(this.input);
        callback(matches, this.nextIndex, this.regexp);
        // if exec matches are complete, reset `nextIndex` here. if not,
        // user should call .reset() at the end of `.exec()` chain; if willing
        // to reuse the RE instance.
        if (this.regexp.lastIndex === 0) {
            this.nextIndex = 0;
        } else {
            this.nextIndex++;
        }
        return this;
    }

    /**
     *  Resets the last index of the internal `RegExp` instance.
     *  This is for convenience that if the user wants to re-use the `Exec`
     *  instance, they should call `.reset()` to reset the `.lastIndex`.
     *  @private
     *
     *  @example
     *  re(/\w+/).exec(str)
     *      .next(function (matches, index) {
     *          console.log(index); // 0
     *      })
     *      .next(function (matches, index) {
     *          console.log(index); // 1
     *      })
     *      .reset()
     *      .next(function (matches, index) {
     *          console.log(index); // 0
     *      });
     */
    reset() {
        // reset exec count/index
        this.nextIndex = 0;
        // `.lastIndex` property is set only if the regular expression instance
        // used the `g` flag to indicate a global search.
        if (this.regexp.global && this.regexp.lastIndex) this.regexp.lastIndex = 0;
        return this;
    }
}

// --------------------------
// CLASS: RE
// --------------------------

/**
 *  `RE` internal class.
 *  @private
 *
 *  @license MIT
 *  @copyright 2016, Onur Yıldırım (onur@cutepilot.com)
 */
class RE {

    /**
     *  Initiates a new instance of `RE`.
     *  @private
     *
     *  @param {RegExp|String} pattern - Either a `RegExp` instance or
     *  string pattern.
     *  @param {String} [flags=""] - Regular Expression flags. Ignored if a
     *  `RegExp` instance is passed as the first argument.
     */
    constructor(pattern, flags) {
        this.input = '';
        this.regexp = !_isRegExp(pattern)
            ? new RegExp(pattern, flags || '')
            // if a RegExp instance is passed, it will be untouched. flags,
            // lastIndex, etc will be changed only on the internal clone, if
            // needed.
            : _cloneRegExp(pattern);

        // reset `.lastIndex`. the passed regexp might be used previously.
        this._reset();
    }

    /**
     *  Resets the last index of the internal `RegExp` instance.
     *  @private
     */
    _reset() {
        // `.lastIndex` property is set only if the regular expression instance
        // used the `g` flag to indicate a global search.
        if (this.regexp.global && this.regexp.lastIndex) this.regexp.lastIndex = 0;
    }

    /**
     *  Gets or sets the flags of the internal `RegExp` instance.
     *  Omit the `value` argument to get the current flags.
     *  @name re#flags
     *  @function
     *
     *  @param {String} [value] - Regular Expression flags to be set.
     *  @returns {String|void}
     */
    flags(value) {
        if (value === undefined) {
            return _getRegExpFlags(this.regexp);
        }
        this.regexp = new RegExp(this.regexp.source, value);
    }

    /**
     *  Ensures that the internal `RegExp` instance has the given flag(s).
     *  You shouldn't need to call this. This method is mostly used internally
     *  and made accessible as a convenience method.
     *  @name re#addFlags
     *  @function
     *  @chainable
     *
     *  @param {String} flags - Regular Expression flags to be added.
     *  @returns {re}
     */
    addFlags(flags) {
        this.regexp = _addFlags(this.regexp, flags);
        return this;
    }

    /**
     *  Removes the given flags from the internal `RegExp` instance.
     *  You shouldn't need to call this. This is only made accessible as a
     *  convenience method.
     *  @name re#removeFlags
     *  @function
     *  @chainable
     *
     *  @param {String} [flags='gimu'] - Regular Expression flags to be removed.
     *  If omitted, all flags are removed.
     *  @returns {re}
     */
    removeFlags(flags = 'gimu') {
        // if falsy, remove all flags
        let f = this.flags();
        flags.split('').forEach(char => {
            f = f.replace(new RegExp(char, 'g'), '');
        });
        this.regexp = new RegExp(this.regexp.source, f);
        return this;
    }

    /**
     *  Gets a clone of the internal `RegExp` instance.
     *  @name re#clone
     *  @function
     *
     *  @returns {RegExp}
     */
    clone() {
        return _cloneRegExp(this.regexp);
    }

    /**
     *  Like `Array#forEach`, invokes the given callback on each `RegExp#exec`
     *  call. The `callback` is invoked with three arguments:
     *  `(matches:Array, index:Number, regexp:RegExp)`.
     *
     *  Callback functions may exit iteration early by explicitly returning
     *  `false`.
     *
     *  @name re#each
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Function} callback - The function invoked per iteration.
     *         This takes three arguments.
     *         See {@link ?api=re#re~callback|`callback`}.
     *  @returns {void}
     *
     *  @example
     *  var input = 'Peter Piper picked a peck of pickled peppers.';
     *  re(/p\w+/i).each(input, function (matches) {
     *      console.log(matches[0]); // logs words starting with a "p"
     *  });
     */
    each(input, callback) {
        // Note: Do not place the regular expression literal (or RegExp
        // constructor) within the while condition or it will create an infinite
        // loop if there is a match due to the lastIndex property being reset
        // upon each iteration. Also be sure that the global flag is set or a
        // loop will occur here also.
        if (!this.regexp.global) this.addFlags('g');
        let matches,
            index = 0;
        while ((matches = this.regexp.exec(input)) !== null) {
            if (callback(matches, index, this.regexp) === false) break;
            index++;
        }
        // reset when we're done!
        this._reset();
    }

    /**
     *  Like `re#each` except that it iterates over matches of collection from
     *  right to left (in other words, last to first).
     *
     *  Callback functions may exit iteration early by explicitly returning
     *  `false`.
     *
     *  @name re#eachRight
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Function} callback - The function invoked per iteration.
     *         This takes three arguments.
     *         See {@link ?api=re#re~callback|`callback`}.
     *  @returns {void}
     *
     *  @example
     *  var input = 'Peter Piper picked a peck of pickled peppers.';
     *  re(/p\w+/i).eachRight(input, function (matches, index) {
     *      if (matches[0] === 'peck') {
     *          console.log('exiting @', index); // —> exiting @ 2
     *          // return early, no more iterations..
     *          return false;
     *      }
     *  });
     */
    eachRight(input, callback) {
        let i,
            arr = this.map(input),
            index = 0;
        for (i = arr.length - 1; i >= 0; i--) {
            if (callback(arr[i], index, this.regexp) === false) break;
            index++;
        }
    }

    /**
     *  Like `Array#map`, maps the results of each `RegExp#exec` iteration while
     *  invoking the given callback function on each match.
     *  @name re#map
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Function} [callback] - The function invoked per iteration.
     *         This takes three arguments.
     *         See {@link ?api=re#re~callback|`callback`}.
     *         If omitted, `matches` will be returned on each iteration.
     *         Note that each match is also an `Array` containing the entire
     *         match result and any parentheses-captured matched results.
     *  @returns {Array}
     *           Array of mapped matches. Returns an empty `Array` if there were
     *           no matches.
     *
     *  @example
     *  var mapped = re(/p\w+/i).map(input, function (matches) {
     *      return matches[0];
     *  });
     *  console.log(mapped);
     *  // —> ["Peter", "Piper", "picked", "peck", "pickled", "peppers"]
     */
    map(input, callback) {
        if (!this.regexp.global) this.addFlags('g');
        let matches,
            result = [],
            index = 0,
            hasCallback = typeof callback === 'function';
        while ((matches = this.regexp.exec(input)) !== null) {
            // each iteration returns an array, we'll pass that and the
            // regexp instance to the invoked callback.
            result.push(hasCallback ? callback(matches, index, this.regexp) : matches);
            index++;
        }
        return result;
    }

    /**
     *  Gets all the matches within the given input string, at once.
     *  Same as `re#map(input)` (with no callback) which returns all matches
     *  without altering matched items.
     *  @name re#all
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @returns {Array}
     *           Array of matches. Returns an empty `Array` if there were no
     *           matches. Note that each match is also an `Array` containing the
     *           entire match result and any parentheses-captured matched results.
     *
     *  @example
     *  re(/p\w+/i).all('Peter picked peppers');
     *  // —> [Array, Array, Array]
     */
    all(input) {
        return this.map(input);
    }

    /**
     *  Returns a chainable  object that provides a `.next()` method to be
     *  called repeatedly, to re-execute the `RegExp` against the input string.
     *
     *  The `.next()` method takes a single `callback` argument.
     *  See {@link ?api=re#re~callback|`callback`}.
     *
     *  @name re#exec
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @returns {Exec}
     *
     *  @example
     *  re(/p\w+/i)
     *      .exec('Peter picked peppers')
     *      .next(function (matches, index) {
     *          console.log(index + ':', matches[0]); // —> 0: "Peter"
     *      })
     *      .next(function (matches, index) {
     *          console.log(index, ':', matches[0]); // —> 1: "picked"
     *      })
     *      ..
     */
    exec(input) {
        return new Exec(this.regexp, input);
    }

    /**
     *  Executes a search for a match within the given input string.
     *  Returns `true` or `false`.
     *  @name re#test
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @returns {Boolean}
     *
     *  @example
     *  re(/p\w+/i).test('Peter picked peppers'); // —> true
     */
    test(input) {
        return this.regexp.test(input);
    }

    /**
     *  Gets the global number of matches within the given input string.
     *  @name re#count
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @returns {Number}
     *
     *  @example
     *  re(/p\w+/i).count('Peter picked peppers'); // —> 3
     */
    count(input) {
        return this.all(input).length;
    }

    /**
     *  Similar to `String#match()`, retreives the matches within the given
     *  input string.
     *  @name re#match
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @returns {Array}
     *           An Array containing the entire match result and any
     *           parentheses-captured matched results, or `null` if there were
     *           no matches.
     *
     *  @example
     *  re(/p\w+/i).match('Peter picked peppers');
     *  // —> ["Peter", "picked", "peppers"]
     */
    match(input) {
        return input.match(this.regexp) || [];
    }

    /**
     *  Gets the first match within the given input string.
     *  Returns `null` if not found.
     *  @name re#first
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Number} [startPosition=0] - Character position index to start with.
     *  @returns {Array}
     *           First match. The returned array has the matched text as the
     *           first item, and then one item for each capturing parenthesis
     *           that matched containing the text that was captured.
     *
     *  @example
     *  re(/p\w+/i).first('Peter picked peppers'); // —> "Peter"
     */
    first(input, startPosition = 0) {
        let matches = this.regexp.exec(input.substr(startPosition));
        this._reset();
        return matches;
    }

    /**
     *  Gets the character position index of the first match against the given
     *  input string.
     *  @name re#firstIndex
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Number} [startPosition=0] - Character position index to start with.
     *  @returns {Number} - Character position index of the first matched result.
     *
     *  @example
     *  re(/p\w+/i).firstIndex('Peter picked peppers'); // —> 0
     */
    firstIndex(input, startPosition = 0) {
        return input.substr(startPosition).search(this.regexp);
    }

    /**
     *  Gets the match at the given (match) index within the given input string.
     *  Returns `null` if not found.
     *  @name re#nth
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Number} [startPosition=0] - Character position index to start with.
     *  @returns {Array}
     *           Match at the given index. The returned array has the matched
     *           text as the first item, and then one item for each capturing
     *           parenthesis that matched containing the text that was captured.
     *
     *  @example
     *  re(/p\w+/i).nth('Peter picked peppers', 1); // —> "picked"
     */
    nth(input, index = 0, startPosition = 0) {
        input = input.substr(startPosition);
        if (index < 0) return null;
        let result = this.all(input);
        if (!result.length || index >= result.length) return null;
        return result[index];
    }

    /**
     *  Gets the last match within the given input string.
     *  Returns `null` if not found.
     *  @name re#last
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Number} [startPosition=0] - Character position index to start with.
     *  @returns {Array}
     *           Last match. The returned array has the matched text as the
     *           first item, and then one item for each capturing parenthesis
     *           that matched containing the text that was captured.
     *
     *  @example
     *  re(/p\w+/i).last('Peter picked peppers'); // —> "peppers"
     */
    last(input) {
        let all = this.all(input);
        return all.length
            ? all[all.length - 1]
            : null;
    }

    /**
     *  Gets the character position index of the last match against the given
     *  input string.
     *  @name re#lastIndex
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Number} [startPosition=0] - Character position index to start with.
     *  @returns {Number} - Character position index of the last matched result.
     *
     *  @example
     *  re(/p\w+/i).lastIndex('Peter picked peppers'); // —> 13
     */
    lastIndex(input, startPosition = 0) {
        let result = this.all(input);
        if (result.length) {
            let lastIndex = result[result.length - 1].index;
            return lastIndex > startPosition
                ? lastIndex - startPosition
                : -1;
        }
        return -1;
    }

    /**
     *  Gets character position indices of all the matches against the given
     *  input string.
     *  @name re#indices
     *  @function
     *
     *  @param {String} input - Source input string.
     *  @param {Number} [startPosition=0] - Character position index to start with.
     *  @returns {Array<Number>}
     *           An array of numbers that indicate all the matched character
     *           position indices.
     *
     *  @example
     *  re(/p\w+/i).indices('Peter picked peppers');
     *  // —> [0, 6, 13]
     */
    indices(input, startPosition = 0) {
        let arr = [];
        this.each(input, matches => {
            if (startPosition <= matches.index) arr.push(matches.index);
        });
        return arr;
    }
}

// --------------------------
// re OBJECT
// --------------------------

/**
 *  `RegExp` API for Humans!
 *
 *  `re` is a shorthand function for initializing an instance of the internal
 *  `RE` class. You can init an instance with a `RegExp` literal or just like
 *  the `RegExp` constructor, pass two string arguments for pattern and flags.
 *
 *  @name re
 *  @function
 *  @global
 *
 *  @param {RegExp|String} pattern - Either a `RegExp` instance or
 *  string pattern.
 *  @param {String} [flags=""] - Regular Expression flags. Ignored if a
 *  `RegExp` instance is passed as the first argument.
 *  @returns {RE} - `RE` instance.
 *
 *  @example
 *  re(/\w+/gm).test('input');
 *  // or
 *  re('\\w+', 'gm').test('input');
 */
function re(pattern, flags) {
    return new RE(pattern, flags);
}

/**
 *  Checks whether the given object is a `RegExp`.
 *  @function
 *
 *  @param {*} object - Object to be checked.
 *  @returns {Boolean}
 */
re.isRegExp = _isRegExp;

/**
 *  Escapes regular expression characters within the given string.
 *  @function
 *
 *  @param {String} pattern - Pattern string to be escaped.
 *  @returns {String}
 */
re.escape = _escapeRegExp;

re.RE = RE;

// --------------------------
// EXPORT
// --------------------------

export default re;

// --------------------------
// ADDITIONAL DOCUMENTATION
// --------------------------

/**
 *  Callback function to be passed as an argument to methods such as
 *  {@link ?api=re#re#each|`re#each`}, {@link ?api=re#re#map|`re#map`}, etc..
 *  This is invoked per `RegExp` iteration with the following signature:
 *
 *  `function (matches:Array, index:Number, regexp:RegExp) {...}`
 *
 *  @callback re~callback
 *
 *  @param {Array} [matches]
 *         An `Array` containing the entire match result and any
 *         parentheses-captured matched results. This object also has an
 *         `.index` property indicating the current match's position.
 *  @param {Number} [index]
 *         Iteration index. For character position index use `matches.index` or
 *         `regexp.lastIndex`.
 * @param {RegExp} [regexp]
 *        Internal `RegExp` instance being used through out the iteration.
 */
