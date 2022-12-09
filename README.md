# Sidekick - Node.js Utilities Library

> Your sidekick to all your projects! Helpers, utilities and quickies.

[![NPM Version][npm-image]][npm-url]
[![CircleCI](https://circleci.com/gh/thanpolas/sidekick.svg?style=svg)](https://circleci.com/gh/thanpolas/sidekick)
[![Twitter Follow](https://img.shields.io/twitter/follow/thanpolas.svg?label=thanpolas&style=social)](https://twitter.com/thanpolas)

# Install

Install the module using NPM:

```
npm install @thanpolas/sidekick --save
```

# Documentation

The helpers and utilities are divided based on their functionality:

## Async

### asyncMapCap(items, fn, concurrency = 5)

-   `items` **{Array\<\*>}** The Items.
-   `fn` **{function(\*): Promise\<\*>}** Function to be applied on the array items.
-   `concurrency` **{number=}** The concurrency, default 5.
-   **Returns {Promise\<Array\<\*>>}** Array of your return values in array
    order.

Executes concurrently the Function "fn" against all the items in the array.
Throttles of concurrency to 5. Use when multiple I/O operations need to be performed.

### allSettledArray(arrayPromises)

-   ℹ️ Does not care for rejected promises.
-   ℹ️ Expects that the results of fulfilled promises are Arrays.

-   `arrayPromsises` **{Array\<Promise>}** An array of promises.
-   **Returns {Promise\<Array\<\*>>}** A Promise with an array of the outcome.

Will run "allSettled()" on the given promises and return all fulfilled
results in a flattened array.

## Collections

### indexArrayToObjectAr(arrayItems, indexCol)

-   `arrayItems` **{Array\\<Object\>}** The array with objects to index.
-   `indexCol` **{string}** The column to index by.
-   **Returns {Object\<Array\<Object\<Array\>\>\>}** Indexed array as an object of Arrays.

Will index an array of objects into an object using the designated
property of the objects as the index pivot. The created objects will be
arrays of items to contain all records matching that index.

#### Example

```js
const itemsArray = [
    {
        id: 1,
        type: 'alpha',
    },
    {
        id: 2,
        type: 'alpha',
    },
    {
        id: 3,
        type: 'beta',
    },
];

const indexedItems = indexArrayToObjectAr(itemsArray, 'type');

console.log(indexedItems);
// {
//     alpha: [
//         {
//             id: 1,
//             type: 'alpha',
//         },
//         {
//             id: 2,
//             type: 'alpha',
//         },
//     ],
//     beta: [
//         {
//             id: 3,
//             type: 'beta',
//         },
//     ]
// }
```

### indexArrayToObject(arrayItems, indexCol)

-   `arrayItems` **{Array\<Object>}** The array with objects to index.
-   `indexCol` **{string}** The column to index by.
-   **Returns {Object\<Array\<Object>>}** Indexed array as an object.

Will index an array of objects into an object using the designated
property of the objects as the index pivot. The created objects will be
objects, overwritting any duplicate indexed items.

#### Example

```js
const itemsArray = [
    {
        id: 1,
        type: 'alpha',
    },
    {
        id: 2,
        type: 'alpha',
    },
    {
        id: 3,
        type: 'beta',
    },
];

const indexedItems = indexArrayToObject(itemsArray, 'type');

console.log(indexedItems);
// {
//     alpha: {
//         id: 2,
//         type: 'alpha',
//     },
//     beta: {
//         id: 3,
//         type: 'beta',
//     },
// }
```

### arrayKeep(ar, arIndex)

-   `ar` **{Array}** An array.
-   `arIndex` **{number}** the index item to retain.
-   **Returns {void}** Array is updated in place.

Will remove all items from the provided array except the one with the defined index.
Uses `splice()` to change the contents of the array in place.

#### Example

```js
const ar = [1, 2, 3, 4];

arrayKeep(ar, 2);

console.log(ar);

// [3]
```

### flatFilter(ar)

-   `ar` **{Array\<\*>}** Array with items.
-   **Returns {Array\<\*>}** Flattened and filtered array.

Will deep flatten the given array and filter our falsy values.

#### Example

```js
const ar = [1, 2, undefined, 0, 5];

console.log(flatFilter(ar));

// [1, 2, 5]
```

### rangeFill(start, end)

-   `start` **{number}** Number to start from.
-   `end` **{number}** Number to end.
-   **Returns {Array\<number>}**

Fills an array with a range of numbers starting and ending as defined.

#### Example

```js
console.log(rangeFill(10, 15));

// [10, 11, 12, 13, 14, 15]
```

## Crypto

### sha256(data)

-   `data` **{string}** Data to produce hash for.
-   **Returns {string}** Hash of the string.

Produce a globally compatible hash. (based on this [SO article](https://stackoverflow.com/questions/5878682/node-js-hash-string))

### fileSha256(absPath, base64 = false)

-   `absPath` **{string}** Absolute path to the file.
-   `base64` **{boolean=}** Set to true for base64 encoding.
-   **Returns {Promise\<string>}** A Promise with the SHA256.

Will produce the SHA256 checksum of a filesystem object.

### hashPassword(password, optSalt)

-   `password` **{string}** The password to hash.
-   `optSalt` **{string=}** Optionally, provide the salt to use, if not provided
    a salt will be generated.
-   **Returns {Promise\<Object>}** Object with two keys:
    -   `salt` **{string}** A string containing the salt.
    -   `hash` **{string}** A string containing the encrypted password.

Hash encrypts the provided string. Uses [crypto.scrypt()](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback).

### passwordsMatch(password, encPass, salt)

-   `password` **{string}** Password to match.
-   `encPass` **{string}** Encrypted password from the database.
-   `salt` **{string}** Salt used to encrypt.
-   **Returns {Promise\<boolean>}** A Promise with a boolean response.

Performs the password matching operation.

### symmetricEncrypt(text, encKey, optPassword)

-   `text` **{string}** Text to encrypt.
-   `encKey` **{string}** Key to use for encrypting.
-   `optPassword` **{string=}** Optionally provide user defined password to use
    in combination with the encryption key.
-   **Returns {Promise\<string>}** Encrypted text combined with IV and salts.

Symmetrically encrypt using AES256 CBC cipher with a random IV.

This function returns a custom string which combines the IV and the
encrypted text, so you'll have to use the accompanied `symmetricDecrypt()`
function. The custom text is built as follows:

> `${hmacHex}:${ivHex}:${salt}:${encryptedContent}`

### symmetricDecrypt(encPackage, encKey, optPassword)

-   `encPackage` **{string}** The encryption package.
-   `encKey` **{string}** Key to use for encrypting.
-   `optPassword` **{string=}** Optionally provide user defined password
    to use in combination with the encryption key.
-   **Returns {Promise\<string>}** Decrypted message.
-   **throws {Error}** When decryption fails.

Symmetrically decrypt using AES256 CBC cipher with a random IV.

This function accepts a custom string which combines the IV and the
encrypted text, so you'll have to encrypt using the accompanied `symmetricEncrypt()`.

## Date

### formatDate(dt)

-   `dt` **{string|Date}** ISO8612 format Date or native date object.
-   **Returns {string}** Extended format of date.

Formats a date string into human readable, extended format.

#### Example

```js
const dt = new Date();

console.log(formatDate(dt));
// Thu, 06 of Oct 2022 at 13:20 +0300
```

### formatDateShort(dt)

-   `dt` **{string|Date}** ISO8612 format Date or native date object.
-   **Returns {string}** Short format of date.

Formats a date string into human readable, short format.

#### Example

```js
const dt = new Date();

console.log(formatDateShort(dt));
// 06/Oct/2022 13:20
```

### unixToJsDate(unixTimestamp)

-   `unixTimestamp` **{\*}** Unix timestamp.
-   **Returns {Date}** JS Native Date.

Converts Unix timestamp to JS Native Date.

### dateDiff(fromDate, toDate = new Date())

-   `fromDate` **{Date}** From which date.
-   `toDate` **{Date=}** To which date, default is now time.
-   **Returns {string}** Human readable difference.

Will format in human readable form the difference between two dates.

## Time

### delay(seconds)

-   `seconds` **{number}** How many seconds to wait.
-   **Return {Promise\<void>}**

An async delay in seconds.

### delayMs(ms)

-   `ms` **{number}** How many miliseconds to wait.
-   **Return {Promise\<void>}**

An async delay in miliseconds.

### errorDelay(retry, maxDelay = 20, delayMultiplier = 1)

-   `retry` **{number}** Retry count of errors.
-   `maxDelay` **{number=}** Maximum delay in seconds.
-   `delayMultiplier` **{number=}** Multiplier of retries to calculate delay
    (multiplies the retry count to calculate the delay).
-   **Returns {Promise\<void>}**

Error specific delay function that incorporates retry count for
ever increasing the delay and a maximum delay to act as a stopgap.

### delayRandom(fromSeconds, toSeconds)

-   `fromSeconds` **{number}** Lowest value of seconds to delay.
-   `toSeconds` **{number}** Highest value of seconds to delay.
-   **Returns {Promise\<number>}** Promise with the delay in seconds.

Random delay between a given range.

### secondsToDhms(seconds, short = false)

-   `seconds` **{number}** Seconds to convert.
-   `short` **{boolean=}** Short version.
-   **Returns {string}** Formatted string.

Converts seconds to human readable format of days, hours, minutes and seconds.

#### Example

```js
console.log(secondsToDhms(3800));
// 1 hour 3 minutes 20 seconds

console.log(secondsToDhms(3800, true));
// 1h:3m:20s
```

## Format

### getPercentHr(denominator, numerator, decimals = 2)

-   `denominator` **{number}** Denominator.
-   `numerator` **{number}** Numerator.
-   `decimals` **{number=}** How many decimals to have, default is 2.
-   **Returns {string}** Human readable percentage.

Get percentage of fraction into human readable format.

#### Example

```js
console.log(getPercentHr(100, 33));
// "33.33%"
```

### shortAddress(address)

-   `address` **{string}** An ethereum address.
-   **Returns {string}**

Shorten an ethereum address as "0x123..98765".

### formatNumber(num)

-   `num` **{number}** The number to format.
-   **Returns {string}**

Format a number in human readable format.

#### Example

```js
console.log(formatNumber(1234567890));
// "1,234,567,890"'
```

## http

### getIp(req)

-   `req` **{express.Request}** The request object.
-   **Returns {string}** The client's ip.

Return the client's IP from an express request object.

## Object

### iterObj(obj, cb)

-   `obj` **{Object}** The object to iterate on.
-   `cb` **{function}** The callback function, with three arguments:
    -   The value of the object iteration
    -   The index of the iteration
    -   The key of the object.
-   **Returns {void}**

Will iterate through an object based on the keys of the object.

### mapObj(obj, cb)

-   `obj` **{Object}** The object to iterate on.
-   `cb` **{function}** The callback function, with three arguments:
    -   The value of the object iteration
    -   The index of the iteration
    -   The key of the object.
-   **Returns {Array\<\*>}** The return of the callback.

Will iterate through an object based on the keys of the object and return
the outcome of the callback, as per Array.map().

### flatCopyObj(srcObj, trgObj, optPrefix = '')

-   `srcObj` **{Object}** Source object.
-   `trgObj` **{Object}** Target object.
-   `optPrefix` **{string=}** Prefix the keys with this string.
-   **Returns {void}** Mutates "trgObj".

Will shallow copy all key/values from source object to target object,
mutates target object.

#### Example

```js
const srcObj = {
    a: {
        id: 1,
        value: 'yes',
    },
    b: {
        id: 2,
        value: 'no',
    },
};

const trgObj = {
    a: {
        id: 10,
        value: 'zit',
    },
    b: {
        id: 11,
        value: 'pit',
    },
};

flatCopyObj(srcObj, trgObj, 'src');

console.log(trgObj);
// {
//     srca: {
//         id: 1,
//         value: 'yes',
//     },
//     srcb: {
//         id: 2,
//         value: 'no',
//     }
//     a: {
//         id: 10,
//         value: 'zit',
//     },
//     b: {
//         id: 11,
//         value: 'pit',
//     },
// }
```

### safeStringify(obj)

-   `obj` **{\*}** Any value to serialize.
-   **Returns {string}** JSON serialized string.

Will safely JSON serialize any value to JSON, accounting for BigInt.

## Perf

### perf(optSince)

-   `optSince` **{bigint=}** return value of hrtime.bigint().
-   **Returns {bigint|Object}** If argument is defined Object, otherwise
    `process.hrtime.bigint()` return value.
    In case of object:
    -   `bigint` **{bigint}** The difference represented in nanoseconds.
    -   `hr` **{string}** The difference represented in human readable format.

Helper for performance measuring of execution time.

Invoke without argument to get the starting timestamp.

Invoke with argument the starting timestamp and get the result of the
perf measurement in human and machine readable format.

## Random

### getRandomIntMinMax(min, max)

-   `min` **{number}** Minimum random number to return.
-   `max` **{number}** Maximum random number to return.
-   **Returns {number}** A random integer number.

Returns a random number from "min" value up to "max" value.

### getUniqueId(optPart)

-   `part` **{string=}** Any arbitrary string to prefix the id with.
-   **Returns {string}**

Produce a unique id on demand.

## String

### splitString(str, numChars = 1800)

-   `str` **{string}** The string to split.
-   `numChars` **{number=}** Number of characters to split the string into.
-   **Returns {Array\<string>}** An array of strings, split based on the numChars.

Will split a string based on its length using numChars or the default value
of 1800 which is intented for spliting long discord messages (limit at 2000).

### stdQuote(str)

-   `str` **{string}** The string to normalize.
-   **Returns {string}** Normalized string.

Will normalize quotes in a given string.

There are many variations of quotes in the unicode character set, this
function attempts to convert any variation of quote to the standard
Quotation Mark - "U+0022 Standard Universal". [Read more about unicode quotes](https://unicode-table.com/en/sets/quotation-marks/)

### humanCSVInputToArray(input)

-   `input` **{string}** input The raw human input.
-   **Returns {Array\<string>}** Space trimmed values.

Will parse and normalize a human input of comma separated values
each item will be trimmed for spaces.

### renderParts(parts, isCli)

-   `parts` **{Array\<string|Array\<string\>\>}** The parts to render.
-   `isCli` **{boolean=}** Set to true to not apply any decorations (i.e. bold).
-   **Returns {string}** Rendered string.

Will render to string an array of single or pair items, used for joining
constructed strings to be used either on Discord or CLI. By default the rendering
will target discord using the `**` notation for bold.

The parts will be separated with a dash (`-`).

When a pair of items is provided, it is implied that the first item is the title
and the second is the value, so the function will make the title bold
(i.e. `['title', 'value']` will make the "title" bold on discord using the `**`
notation).

#### Example

```js
const parts = [];
parts.push('Hear me out');
parts.push('these are the results');
parts.push(['player 1', '120']);
parts.push(['player 2', '420']);
parts.push(['Winner', 'Player 2']);

const strDiscord = renderParts(parts);
// Hear me out - these are the results - **player 1**: 120 - **player 2**: 420 - **Winner**: Player 2

const strCli = renderParts(parts, true);
// Hear me out - these are the results - player 1: 120 - player 2: 420 - Winner: Player 2
```

# Maintainance

## Update Node Version

When a new node version is available you need to updated it in the following:

-   `/package.json`
-   `/.nvmrc`
-   `/.circleci/config.yml`

## Releasing

1. Update the changelog bellow ("Release History").
1. Ensure you are on master and your repository is clean.
1. Type: `npm run release` for patch version jump.
    - `npm run release:minor` for minor version jump.
    - `npm run release:major` for major major jump.

## Release History

-   **v1.0.6**, _10 Oct 2022_
    -   Property exported `getRandomIntMinMax()`.
    -   Fixed `delayRandom()` using wrong randomizer function.
-   **v1.0.5**, _06 Oct 2022_
    -   Added `getUniqueId()`.
    -   Added `dateDiff()`.
    -   Fix broken reference on `perf()`.
-   **v1.0.0**, _06 Oct 2022_
    -   Big Bang

## License

Copyright © [Thanos Polychronakis][thanpolas] and Authors, [Licensed under ISC](/LICENSE).

[npm-url]: https://npmjs.org/package/@thanpolas/sidekick
[npm-image]: https://img.shields.io/npm/v/@thanpolas/sidekick.svg
[thanpolas]: https://github.com/thanpolas
