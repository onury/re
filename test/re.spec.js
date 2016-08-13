'use strict';

/**
 *  Test Suite: re
 *  @module   re.spec
 *  @version  2016-08-12
 */

const re = require('../dist/re');

describe('re', () => {
    'use strict';

    // DO NOT MODIFY either the contents or the format of this string.
    const strTest = `Lorem Ipsum is simply dummy text of the printing and
    typesetting industry. Lorem Ipsum has been the industry's standard dummy
    text ever since the 1500s, when an unknown printer took a galley of type and
    scrambled it to make a type specimen book. It has survived not only five
    centuries, but also the leap into electronic typesetting, remaining
    essentially unchanged. It was popularised in the 1960s with the release of
    Letraset sheets containing Lorem Ipsum passages, and more recently with
    desktop publishing software like Aldus PageMaker including versions of Lorem
    Ipsum. `;
    // DO NOT MODIFY
    const sWords = [
        'simply',
        'standard',
        'since',
        'scrambled',
        'specimen',
        'survived',
        'sheets',
        'software'
    ];
    const sWordsIndices = [15, 115, 144, 215, 243, 265, 452, 538];

    // beforeAll(function () {});

    it('General', () => {
        const regexp = /\w+/gm;
        expect(re.isRegExp(regexp)).toEqual(true);
        expect(re.isRegExp('invalid')).toEqual(false);
        let instance = re(/\w+/m);
        expect(instance instanceof re.RE).toEqual(true);
        expect(instance.regexp instanceof RegExp).toEqual(true);
        instance.flags('gi');
        expect(instance.regexp.global).toEqual(true);
        expect(instance.regexp.multiline).toEqual(false);
        expect(instance.regexp.ignoreCase).toEqual(true);
        expect(instance.flags()).toEqual('gi');
        instance.removeFlags('gi');
        // console.log(instance.flags());
        expect(instance.regexp.global).toEqual(false);
        expect(instance.regexp.multiline).toEqual(false);
        expect(instance.regexp.ignoreCase).toEqual(false);
    });

    it('.each()', () => {
        let originalRegexp = /lorem/i,
            internalRegexp;
        let result = [];
        re(originalRegexp).each(strTest, (matches, index, regexp) => {
            result.push(matches[0]);
            internalRegexp = regexp;
        });
        expect(originalRegexp).not.toEqual(internalRegexp);
        expect(originalRegexp.global).toEqual(false);
        expect(internalRegexp.global).toEqual(true);
        expect(originalRegexp.lastIndex).toEqual(0);
        expect(internalRegexp.lastIndex).toEqual(0);
        expect(result.length).toEqual(4);
        expect(result[3]).toEqual('Lorem');

        // reset
        result = [];
        // test "return early"
        re(originalRegexp).each(strTest, (matches, index, regexp) => {
            result.push(matches[0]);
            internalRegexp = regexp;
            // break iteration @ second
            if (index === 1) return false;
        });
        expect(originalRegexp.global).toEqual(false);
        expect(internalRegexp.global).toEqual(true);
        expect(originalRegexp.lastIndex).toEqual(0);
        expect(internalRegexp.lastIndex).toEqual(0);
        expect(result.length).toEqual(2);
        expect(result[1]).toEqual('Lorem');

        // no match
        re(/NOT_FOUND/).each(strTest, () => {
            console.log('THIS SHOULD NOT LOG!');
        });
    });

    it('.eachRight()', () => {
        let originalRegexp = /\bs\w+\b/i, // words starting with 's'
            internalRegexp;
        let result = [];
        re(originalRegexp).eachRight(strTest, (matches, index, regexp) => {
            result.push(matches[0]);
            internalRegexp = regexp;
            // console.log(matches);
        });
        expect(originalRegexp).not.toEqual(internalRegexp);
        expect(originalRegexp.global).toEqual(false);
        expect(internalRegexp.global).toEqual(true);
        expect(result[0]).toEqual(sWords[sWords.length - 1]);
        expect(result[result.length - 1]).toEqual(sWords[0]);

        // reset
        result = [];
        // test "return early"
        re(originalRegexp).eachRight(strTest, (matches, index, regexp) => {
            result.push(matches[0]);
            internalRegexp = regexp;
            // break iteration @ second
            if (index === 1) return false;
        });
        expect(result[result.length - 1]).toEqual(sWords[sWords.length - 2]);
    });

    it('.map(), .all()', () => {
        let regx = /lorem/i;
        let result = re(regx).map(strTest, (matches, index) => {
            return matches[0];
        });
        expect(result.length).toEqual(4);
        expect(result[3]).toEqual('Lorem');
        // lastIndex is untouched
        expect(regx.lastIndex).toEqual(0);

        result = re(regx).map(strTest);
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(jasmine.any(Array));
        expect(result[0].length).toEqual(1);

        result = re(/NOT_FOUND/).map(strTest);
        expect(result).toEqual(jasmine.any(Array));
        expect(result.length).toEqual(0);
    });

    it('.exec(), .next(), .reset()', () => {
        let originalRegexp = /\bs[a-z]+\b/i;
        let internalRegexp;
        let instance = re(originalRegexp);
        let rexInstance = instance.exec(strTest)
            .next((matches, index, regexp) => {
                expect(originalRegexp.lastIndex).toEqual(0);
                expect(matches[0]).toEqual(sWords[0]);
                expect(index).toEqual(0);
            })
            .next((matches, index, regexp) => {
                expect(matches[0]).toEqual(sWords[1]);
                expect(index).toEqual(1);
            })
            .next((matches, index, regexp) => {
                expect(matches[0]).toEqual(sWords[2]);
                expect(index).toEqual(2);
                internalRegexp = regexp;
            });
        expect(internalRegexp.global).toEqual(true);
        expect(internalRegexp.lastIndex).not.toEqual(0);
        rexInstance.reset();
        expect(internalRegexp.lastIndex).toEqual(0);
    });

    it('.first(), .last(), .nth(), .firstIndex(), .lastIndex(), .indices()', () => {
        let regx = /\bs[a-z]+\b/i,
            instance = re(regx),
            indices = instance.indices(strTest),
            first = instance.first(strTest),
            firstIndex = instance.firstIndex(strTest),
            last = instance.last(strTest),
            lastIndex = instance.lastIndex(strTest);

        expect(indices.length).toEqual(sWords.length);
        expect(first[0]).toEqual(sWords[0]);
        expect(first.index).toEqual(firstIndex);
        expect(indices[0]).toEqual(firstIndex);
        expect(firstIndex).toEqual(sWordsIndices[0]);
        expect(last[0]).toEqual(sWords[sWords.length - 1]);
        expect(last.index).toEqual(lastIndex);
        expect(lastIndex).toEqual(sWordsIndices[sWordsIndices.length - 1]);
        expect(indices[indices.length - 1]).toEqual(lastIndex);

        expect(instance.nth(strTest, 2)[0]).toEqual(sWords[2]);
        expect(instance.nth(strTest, 4)[0]).toEqual(sWords[4]);

        // test with `startPosIndex`
        // [15, 115, 144, 215, 243, 265, 452, 538];
        //     ^———
        let expectedPosIndex = 5,
            startPosIndex = indices[1] - expectedPosIndex;
        expect(instance.first(strTest, startPosIndex)[0]).toEqual(sWords[1]);
        expect(instance.firstIndex(strTest, startPosIndex)).toEqual(expectedPosIndex);

        expect(instance.nth(strTest, 3, startPosIndex)[0]).toEqual(sWords[4]);
        expect(instance.nth(strTest, 5, startPosIndex)[0]).toEqual(sWords[sWords.length - 2]);

        indices = instance.indices(strTest, sWordsIndices[3] - expectedPosIndex);
        expect(indices.length).toEqual(expectedPosIndex);
        expect(indices[0]).toEqual(sWordsIndices[3]);
        // lastIndex = sWordsIndices[sWordsIndices.length - 1];
        expect(instance.lastIndex(strTest, startPosIndex)).toEqual(lastIndex - startPosIndex);
    });

});
