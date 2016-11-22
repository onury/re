(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("re", [], factory);
	else if(typeof exports === 'object')
		exports["re"] = factory();
	else
		root["re"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _re = __webpack_require__(1);
	
	var _re2 = _interopRequireDefault(_re);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// export default re;
	// http://stackoverflow.com/a/33683495/112731
	module.exports = _re2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	    var arr = str.split('');
	    return arr.filter(function (value, index, list) {
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
	
	var Exec = function () {
	
	    /**
	     *  Initiates a new instance of `Exec` class.
	     *  @private
	     *
	     *  @param {RegExp} regexp - RegExp instance.
	     *  @param {String} input - Source input string.
	     */
	    function Exec(regexp, input) {
	        _classCallCheck(this, Exec);
	
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
	     *         See {@link ?api=re#re~callback|`callback`}.
	     *  @returns {Exec} - Returns the current `Exec` instance (for
	     *  chainability and) so that `.next()` can be called repeatedly.
	     */
	
	
	    _createClass(Exec, [{
	        key: 'next',
	        value: function next(callback) {
	            if (!this.regexp.global) {
	                this.regexp = _addFlags(this.regexp, 'g');
	            }
	            var matches = this.regexp.exec(this.input);
	            callback(matches, this.nextIndex, this.regexp, matches.index);
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
	
	    }, {
	        key: 'reset',
	        value: function reset() {
	            // reset exec count/index
	            this.nextIndex = 0;
	            // `.lastIndex` property is set only if the regular expression instance
	            // used the `g` flag to indicate a global search.
	            if (this.regexp.global && this.regexp.lastIndex) this.regexp.lastIndex = 0;
	            return this;
	        }
	    }]);
	
	    return Exec;
	}();
	
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
	
	
	var RE = function () {
	
	    /**
	     *  Initiates a new instance of `RE`.
	     *  @private
	     *
	     *  @param {RegExp|String} pattern - Either a `RegExp` instance or
	     *  string pattern.
	     *  @param {String} [flags=""] - Regular Expression flags. Ignored if a
	     *  `RegExp` instance is passed as the first argument.
	     */
	    function RE(pattern, flags) {
	        _classCallCheck(this, RE);
	
	        this.input = '';
	        this.regexp = !_isRegExp(pattern) ? new RegExp(pattern, flags || '')
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
	
	
	    _createClass(RE, [{
	        key: '_reset',
	        value: function _reset() {
	            // `.lastIndex` property is set only if the regular expression instance
	            // used the `g` flag to indicate a global search.
	            if (this.regexp.global && this.regexp.lastIndex) this.regexp.lastIndex = 0;
	        }
	
	        /**
	         *  Gets or sets the flags of the internal `RegExp` instance.
	         *  Omit the `value` argument to get the current flags.
	         *  @name re.flags
	         *  @function
	         *
	         *  @param {String} [value] - Regular Expression flags to be set.
	         *  @returns {String|void}
	         */
	
	    }, {
	        key: 'flags',
	        value: function flags(value) {
	            if (value === undefined) {
	                return _getRegExpFlags(this.regexp);
	            }
	            this.regexp = new RegExp(this.regexp.source, value);
	        }
	
	        /**
	         *  Ensures that the internal `RegExp` instance has the given flag(s).
	         *  You shouldn't need to call this. This method is mostly used internally
	         *  and made accessible as a convenience method.
	         *  @name re.addFlags
	         *  @function
	         *  @chainable
	         *
	         *  @param {String} flags - Regular Expression flags to be added.
	         *  @returns {re}
	         */
	
	    }, {
	        key: 'addFlags',
	        value: function addFlags(flags) {
	            this.regexp = _addFlags(this.regexp, flags);
	            return this;
	        }
	
	        /**
	         *  Removes the given flags from the internal `RegExp` instance.
	         *  You shouldn't need to call this. This is only made accessible as a
	         *  convenience method.
	         *  @name re.removeFlags
	         *  @function
	         *  @chainable
	         *
	         *  @param {String} [flags='gimu'] - Regular Expression flags to be removed.
	         *  If omitted, all flags are removed.
	         *  @returns {re}
	         */
	
	    }, {
	        key: 'removeFlags',
	        value: function removeFlags() {
	            var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'gimu';
	
	            // if falsy, remove all flags
	            var f = this.flags();
	            flags.split('').forEach(function (char) {
	                f = f.replace(new RegExp(char, 'g'), '');
	            });
	            this.regexp = new RegExp(this.regexp.source, f);
	            return this;
	        }
	
	        /**
	         *  Gets a clone of the internal `RegExp` instance.
	         *  @name re.clone
	         *  @function
	         *
	         *  @returns {RegExp}
	         */
	
	    }, {
	        key: 'clone',
	        value: function clone() {
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
	         *  @name re.each
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @param {Function} callback - The function invoked per iteration.
	         *         This takes four arguments.
	         *         See {@link ?api=re#re~callback|`callback`}.
	         *  @returns {void}
	         *
	         *  @example
	         *  var input = 'Peter Piper picked a peck of pickled peppers.';
	         *  re(/p\w+/i).each(input, function (matches, index, regexp, charIndex) {
	         *      console.log(matches[0]); // logs words starting with a "p"
	         *  });
	         */
	
	    }, {
	        key: 'each',
	        value: function each(input, callback) {
	            // Note: Do not place the regular expression literal (or RegExp
	            // constructor) within the while condition or it will create an infinite
	            // loop if there is a match due to the lastIndex property being reset
	            // upon each iteration. Also be sure that the global flag is set or a
	            // loop will occur here either.
	            if (!this.regexp.global) this.addFlags('g');
	            var matches = void 0,
	                index = 0;
	            while ((matches = this.regexp.exec(input)) !== null) {
	                if (callback(matches, index, this.regexp, matches.index) === false) break;
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
	         *  @name re.eachRight
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @param {Function} callback - The function invoked per iteration.
	         *         This takes four arguments.
	         *         See {@link ?api=re#re~callback|`callback`}.
	         *  @returns {void}
	         *
	         *  @example
	         *  var input = 'Peter Piper picked a peck of pickled peppers.';
	         *  re(/p\w+/i).eachRight(input, function (matches, index) {
	         *      if (matches[0] === 'peck') {
	         *          console.log('exiting @', index); // —> exiting @ 3
	         *          // return early, no more iterations..
	         *          return false;
	         *      }
	         *  });
	         */
	
	    }, {
	        key: 'eachRight',
	        value: function eachRight(input, callback) {
	            var i = void 0,
	                arr = this.map(input);
	            for (i = arr.length - 1; i >= 0; i--) {
	                if (callback(arr[i], i, this.regexp) === false) break;
	            }
	        }
	
	        /**
	         *  Like `re#each` except that this will iterate over non-matched blocks.
	         *
	         *  Callback functions may exit iteration early by explicitly returning
	         *  `false`.
	         *
	         *  <b>Remark</b>: This is an experimental feature.
	         *
	         *  @name re.eachInverse
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @param {Function} callback - The function invoked per iteration.
	         *         This takes four arguments.
	         *         See {@link ?api=re#re~callback|`callback`}.
	         *  @returns {void}
	         *
	         *  @example
	         *  var input = 'foo1bar2baz';
	         *  re(/\d/i).eachInverse(input, function (matches, index) {
	         *      if (index === 1) {
	         *          console.log(matches[0]); // —> "bar"
	         *          // return early, no more iterations..
	         *          return false;
	         *      }
	         *  });
	         */
	
	    }, {
	        key: 'eachInverse',
	        value: function eachInverse(input, callback) {
	            if (!this.regexp.global) this.addFlags('g');
	            var invMatch = void 0,
	                matches = void 0,
	                lastCharIndex = -1,
	                index = 0,
	                broke = false;
	
	            // NOTE: `invMatch` will be a string but we'll make it an array for
	            // consistency with other methods.
	
	            while ((matches = this.regexp.exec(input)) !== null) {
	                // check if first match character is 0 or not
	                if (index === 0 && matches.index > 0) {
	                    // take the first offset as the first inverse match
	                    invMatch = input.slice(0, matches.index);
	                    broke = callback([invMatch], index, this.regexp, matches.index) === false;
	                    if (broke) break;
	                }
	                // this will run after the first iteration
	                if (lastCharIndex > 0) {
	                    invMatch = input.slice(lastCharIndex, matches.index);
	                    broke = callback([invMatch], index, this.regexp, matches.index) === false;
	                    if (broke) break;
	                }
	                // set the last character index of the current match for later use
	                lastCharIndex = matches.index + (matches[0] || '').length;
	                index++;
	            }
	            // check if we have remaining sub-string after the last exec match.
	            // we should run this only if user didn't break (return false) before.
	            if (!broke && lastCharIndex <= input.length - 1) {
	                invMatch = input.slice(lastCharIndex, input.length);
	                callback([invMatch], index, this.regexp, lastCharIndex);
	            }
	            // reset when we're done!
	            this._reset();
	        }
	
	        /**
	         *  Like `Array#map`, maps the results of each `RegExp#exec` iteration while
	         *  invoking the given callback function on each match.
	         *  @name re.map
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @param {Function} [callback] - The function invoked per iteration.
	         *         This takes four arguments.
	         *         See {@link ?api=re#re~callback|`callback`}.
	         *         If omitted, `matches` will be returned on each iteration.
	         *         Note that each match is also an `Array` containing the entire
	         *         match result and any parentheses-captured matched results.
	         *  @returns {Array}
	         *           Array of mapped matches (modified via `callback` if defined).
	         *           Returns an empty `Array` if there were no matches.
	         *
	         *  @example
	         *  var mapped = re(/p\w+/i).map(input, function (matches) {
	         *      return matches[0];
	         *  });
	         *  console.log(mapped);
	         *  // —> ["Peter", "Piper", "picked", "peck", "pickled", "peppers"]
	         */
	
	    }, {
	        key: 'map',
	        value: function map(input, callback) {
	            if (!this.regexp.global) this.addFlags('g');
	            var matches = void 0,
	                result = [],
	                index = 0,
	                hasCallback = typeof callback === 'function';
	            while ((matches = this.regexp.exec(input)) !== null) {
	                // each iteration returns an array, we'll pass that and the
	                // regexp instance to the invoked callback.
	                result.push(hasCallback ? callback(matches, index, this.regexp, matches.index) : matches);
	                index++;
	            }
	            return result;
	        }
	
	        /**
	         *  Gets all the matches within the given input string, at once.
	         *  Same as `re#map(input)` (with no callback) which returns all matches.
	         *  @name re.all
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
	
	    }, {
	        key: 'all',
	        value: function all(input) {
	            return this.map(input);
	        }
	
	        /**
	         *  Returns a chainable  object that provides a `.next()` method to be
	         *  called repeatedly, to re-execute the `RegExp` against the input string.
	         *
	         *  The `.next()` method takes a single `callback` argument.
	         *  See {@link ?api=re#re~callback|`callback`}.
	         *
	         *  @name re.exec
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
	
	    }, {
	        key: 'exec',
	        value: function exec(input) {
	            return new Exec(this.regexp, input);
	        }
	
	        /**
	         *  Executes a search for a match within the given input string.
	         *  Returns `true` or `false`.
	         *  @name re.test
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @returns {Boolean}
	         *
	         *  @example
	         *  re(/p\w+/i).test('Peter picked peppers'); // —> true
	         */
	
	    }, {
	        key: 'test',
	        value: function test(input) {
	            return this.regexp.test(input);
	        }
	
	        /**
	         *  Gets the global number of matches within the given input string.
	         *  @name re.count
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @returns {Number}
	         *
	         *  @example
	         *  re(/p\w+/i).count('Peter picked peppers'); // —> 3
	         */
	
	    }, {
	        key: 'count',
	        value: function count(input) {
	            return this.all(input).length;
	        }
	
	        /**
	         *  Similar to `String#match()`, retreives the matches within the given
	         *  input string.
	         *  @name re.match
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @returns {Array<String>}
	         *           An Array containing the entire match result and any
	         *           parentheses-captured matched results, or `null` if there were
	         *           no matches.
	         *
	         *  @example
	         *  re(/p\w+/i).match('Peter picked peppers');
	         *  // —> ["Peter", "picked", "peppers"]
	         */
	
	    }, {
	        key: 'match',
	        value: function match(input) {
	            return input.match(this.regexp) || [];
	        }
	
	        /**
	         *  Gets the first match within the given input string.
	         *  Returns `null` if not found.
	         *  @name re.first
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
	         *  re(/p\w+/i).first('Peter picked peppers')[0]; // —> "Peter"
	         */
	
	    }, {
	        key: 'first',
	        value: function first(input) {
	            var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	            var matches = this.regexp.exec(input.substr(startPosition));
	            this._reset();
	            return matches || [];
	        }
	
	        /**
	         *  Gets the character position index of the first match against the given
	         *  input string.
	         *  @name re.firstIndex
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @param {Number} [startPosition=0] - Character position index to start with.
	         *  @returns {Number} - Character position index of the first matched result.
	         *
	         *  @example
	         *  re(/p\w+/i).firstIndex('Peter picked peppers'); // —> 0
	         */
	
	    }, {
	        key: 'firstIndex',
	        value: function firstIndex(input) {
	            var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	            return input.substr(startPosition).search(this.regexp);
	        }
	
	        /**
	         *  Gets the match at the given (match) index within the given input string.
	         *  Returns `null` if not found.
	         *  @name re.nth
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
	         *  re(/p\w+/i).nth('Peter picked peppers', 1)[0]; // —> "picked"
	         */
	
	    }, {
	        key: 'nth',
	        value: function nth(input) {
	            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	            var startPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	
	            input = input.substr(startPosition);
	            if (index < 0) return null;
	            var result = this.all(input);
	            if (!result.length || index >= result.length) return null;
	            return result[index];
	        }
	
	        /**
	         *  Gets the last match within the given input string.
	         *  Returns `null` if not found.
	         *  @name re.last
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
	         *  re(/p\w+/i).last('Peter picked peppers')[0]; // —> "peppers"
	         */
	
	    }, {
	        key: 'last',
	        value: function last(input) {
	            var all = this.all(input);
	            return all.length ? all[all.length - 1] : null;
	        }
	
	        /**
	         *  Gets the character position index of the last match against the given
	         *  input string.
	         *  @name re.lastIndex
	         *  @function
	         *
	         *  @param {String} input - Source input string.
	         *  @param {Number} [startPosition=0] - Character position index to start with.
	         *  @returns {Number} - Character position index of the last matched result.
	         *
	         *  @example
	         *  re(/p\w+/i).lastIndex('Peter picked peppers'); // —> 13
	         */
	
	    }, {
	        key: 'lastIndex',
	        value: function lastIndex(input) {
	            var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	            var result = this.all(input);
	            if (result.length) {
	                var lastIndex = result[result.length - 1].index;
	                return lastIndex > startPosition ? lastIndex - startPosition : -1;
	            }
	            return -1;
	        }
	
	        /**
	         *  Gets character position indices of all the matches against the given
	         *  input string.
	         *  @name re.indices
	         *  @alias re.charIndices
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
	
	    }, {
	        key: 'indices',
	        value: function indices(input) {
	            var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	            var arr = [];
	            this.each(input, function (matches, index, regexp, charIndex) {
	                if (startPosition <= charIndex) arr.push(charIndex);
	            });
	            return arr;
	        }
	
	        /**
	         *  Alias of `re#indices`.
	         *  @private
	         */
	
	    }, {
	        key: 'charIndices',
	        value: function charIndices(input) {
	            var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	            return this.indices(input, startPosition);
	        }
	    }]);
	
	    return RE;
	}();
	
	// --------------------------
	// re OBJECT
	// --------------------------
	
	/**
	 *  `RegExp` API for Humans!
	 *
	 *  For example, if you place regular expression literal or `RegExp` constructor
	 *  within a `while` condition, you'll hit an infinite loop if there is a match!
	 *  (Because the `RegExp` instance is re-initiated every time; which resets
	 *  `lastIndex` to `0`).
	 *
	 *  Or if you forget the `global` flag for a `RegExp#exec()` call in a `while`
	 *  condition; you'll again, hit an infinite loop!
	 *
	 *  Using `re`, you don't need to deal with these.
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
	
	exports.default = re;
	
	// --------------------------
	// ADDITIONAL DOCUMENTATION
	// --------------------------
	
	/**
	 *  Callback function to be passed as an argument to methods such as
	 *  {@link ?api=re#re#each|`re#each`}, {@link ?api=re#re#map|`re#map`}, etc..
	 *  This is invoked per `RegExp` iteration with the following signature:
	 *
	 *  `function (matches:Array, index:Number, regexp:RegExp, charIndex:Number) {...}`
	 *
	 *  @callback re~callback
	 *
	 *  @param {Array} [matches]
	 *         An `Array` containing the entire match result and any
	 *         parentheses-captured matched results.
	 *  @param {Number} [index]
	 *         Current match (iteration) index.
	 *  @param {RegExp} [regexp]
	 *         Internal `RegExp` instance being used through out the iteration.
	 *  @param {Number} [charIndex]
	 *         Character index of the matched string.
	 *         Same as `regexp.lastIndex` or `matches.index`.
	 */

/***/ }
/******/ ])
});
;
//# sourceMappingURL=re.js.map