/**
 * @fileoverview Generic helpers
 */

const _ = require('lodash');
const Bluebird = require('bluebird');
const format = require('date-fns/format');

/**
 * Executes concurrently the Function "fn" against all the  items in the array.
 * Throttles of concurrency to 5.
 *
 * Use when multiple I/O operations need to be performed.
 *
 * @param {Array<*>} items Items.
 * @param {function(*): Promise<*>} fn Function to be applied on the array items.
 * @param {number=} concurrency The concurrency, default 5.
 * @return {Promise<*>}
 */
exports.asyncMapCap = (items, fn, concurrency = 5) =>
  Bluebird.map(items, fn, { concurrency });

/**
 * An async delay, to time sending messages.
 *
 * @param {number} seconds How many seconds to wait.
 * @return {Promise<void>}
 */
exports.delay = (seconds) => {
  return exports.delayMs(seconds * 1000);
};

/**
 * Error specific delay function that incorporates retry count for
 * ever increasing the delay and a maximum delay to act as a stopgap.
 *
 * @param {number} retry Retry count of errors.
 * @param {number=} maxDelay Maximum delay in seconds.
 * @param {number=} delayMultiplier Multiplier of retries to calculate delay.
 * @return {Promise<void>}
 */
exports.errorDelay = (retry, maxDelay = 20, delayMultiplier = 1) => {
  const secondsToDelay = retry * delayMultiplier;
  const delayActual = secondsToDelay <= maxDelay ? secondsToDelay : maxDelay;
  return exports.delay(delayActual);
};

/**
 * An async delay in milliseconds.
 *
 * @param {number} ms How many seconds to wait.
 * @return {Promise<void>}
 */
exports.delayMs = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Random delay between a given range.
 *
 * @param {number} fromSeconds Lowest value of seconds to delay
 * @param {number} toSeconds Highest value of seconds to delay.
 * @return {Promise<number>} Promise with the delay in seconds.
 */
exports.delayRandom = async (fromSeconds, toSeconds) => {
  const diff = toSeconds - fromSeconds;

  const delayRand = exports.getRandomInt(diff);

  const delay = fromSeconds + delayRand;

  await exports.delay(delay);

  return delay;
};

/**
 * Will split a string based on its length using numChars or the default value
 * of 1800 which is intented for spliting long discord messages (limit at 2000).
 *
 * @param {string} str The string to split.
 * @param {number=} [numChars=1800] Number of characters to split the string into.
 * @return {Array<string>} An array of strings, split based on the numChars.
 */
exports.splitString = (str, numChars = 1800) => {
  if (!str) {
    return str;
  }
  const ret = [];
  let offset = 0;
  while (offset < str.length) {
    ret.push(str.substring(offset, numChars + offset));
    offset += numChars;
  }

  return ret;
};

/**
 * Returns a random number from 0 up to a total of maximum numbers
 * (not inclusive) as defined.
 *
 * @param {number} max Maximum random number to return.
 * @return {number} A random integer number.
 */
exports.getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Formats a date string into human readable, extended format.
 *
 * @param {string} dt ISO8612 format Date.
 * @return {string} Appropriately formated date to be used on call.
 */
exports.formatDate = (dt) => {
  return format(new Date(dt), "eee, do 'of' MMM yyyy 'at' HH:mm OOOO");
};

/**
 * Formats a date string into human readable, short format.
 *
 * @param {string} dt ISO8612 format Date.
 * @return {string} Appropriately formated date.
 */
exports.formatDateShort = (dt) => {
  return format(new Date(dt), 'dd/MMM/yy HH:mm');
};

/**
 * Will normalize quotes in a given string. There are many variations of quotes
 * in the unicode character set, this function attempts to convert any variation
 * of quote to the standard Quotation Mark - U+0022 Standard Universal: "
 *
 * @param {string} str The string to normalize
 * @return {string} Normalized string.
 * @see https://unicode-table.com/en/sets/quotation-marks/
 */
exports.stdQuote = (str) => {
  const allQuotes = [
    '“', // U+201c
    '«', // U+00AB
    '»', // U+00BB
    '„', // U+201E
    '“', // U+201C
    '‟', // U+201F
    '”', // U+201D
    '❝', // U+275D
    '❞', // U+275E
    '〝', // U+301D
    '〞', // U+301E
    '〟', // U+301F
    '＂', // U+FF02
  ];

  const stdQuote = '"'; // U+0022

  const normalized = allQuotes.reduce((strNorm, quoteChar) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const re = new RegExp(quoteChar, 'g');
    return strNorm.replace(re, stdQuote);
  }, str);

  return normalized;
};

/**
 * Will index an array of objects into an object using the designated
 * property of the objects as the index pivot. The created objects will be
 * arrays of items to contain all records matching that index.
 *
 * @param {Array<Object>} arrayItems The array with objects to index.
 * @param {string} indexCol The column to index by.
 * @return {Object<Array<Object<Array>>>} Indexed array as an object of Arrays.
 */
exports.indexArrayToObjectAr = (arrayItems, indexCol) => {
  const indexed = {};

  arrayItems.forEach((arrayItem) => {
    const itemId = arrayItem[indexCol];
    if (indexed[itemId]) {
      indexed[itemId].push(arrayItem);
    } else {
      indexed[itemId] = [arrayItem];
    }
  });
  return indexed;
};

/**
 * Will index an array of objects into an object using the designated
 * property of the objects as the index pivot. The created objects will be
 * objects, overwritting any duplicate indexed items.
 *
 * @param {Array<Object>} arrayItems The array with objects to index.
 * @param {string} indexCol The column to index by.
 * @return {Object<Array<Object>>} Indexed array as an object of Arrays.
 */
exports.indexArrayToObject = (arrayItems, indexCol) => {
  const indexed = {};

  arrayItems.forEach((arrayItem) => {
    const itemId = arrayItem[indexCol];
    indexed[itemId] = arrayItem;
  });
  return indexed;
};

/**
 * Will remove all items from the provided array except the one with the defined
 * index.
 *
 * @param {Array} ar An array.
 * @param {number} arIndex the index item to retain.
 * @return {void} Array is updated in place.
 */
exports.arrayKeep = (ar, arIndex) => {
  ar.splice(0, arIndex);
  ar.splice(1);
};

/**
 * Will iterate through an object based on the keys of the object.
 *
 * @param {Object} obj The object to iterate on.
 * @param {function} fn The function to call back, with three arguments:
 *    - The value of the object iteration
 *    - The index of the iteration
 *    - The key of the object.
 * @return {void}
 */
exports.iterObj = (obj, fn) => {
  const allKeys = Object.keys(obj);
  allKeys.forEach((key, index) => {
    fn(obj[key], index, key);
  });
};

/**
 * Will iterate through an object based on the keys of the object and return
 * the outcome of the callback, as per Array.map().
 *
 * @param {Object} obj The object to iterate on.
 * @param {function} fn The function to call back, with three arguments:
 *    - The value of the object iteration
 *    - The index of the iteration
 *    - The key of the object.
 * @return {*} The return of the callback.
 */
exports.mapObj = (obj, fn) => {
  const allKeys = Object.keys(obj);
  return allKeys.map((key, index) => {
    return fn(obj[key], index, key);
  });
};

/**
 * Will run "allSettled()" on the given promises and return all fulfilled
 * results in a flattened array.
 *  - Does not care for rejected promises.
 *  - Expects that the results of fulfilled promises are Arrays.
 *
 * @param {Array<Promise>} arrayProms An array of promises.
 * @return {Promise<Array>} A Promise with an array of the outcome.
 */
exports.allSettledArray = async (arrayProms) => {
  const results = await Promise.allSettled(arrayProms);

  const fulfilled = results.filter((res) => res.status === 'fulfilled');
  const result = fulfilled.reduce((allResults, current) => {
    const combined = allResults.concat(current.value);

    return combined;
  }, []);

  return result;
};

/**
 * Will deep flatten the given array and filter our falsy values.
 *
 * @param {Array<*>} ar Array with items.
 * @return {Array<*>} Flattened and filtered array.
 */
exports.flatFilter = (ar) => {
  return _.flattenDeep(ar).filter((v) => !!v);
};

/**
 * Helper for performance measuring of execution time.
 *
 * Invoke without argument to get the starting timestamp.
 * Invoke with argument the starting timestamp and get the result of the
 * perf measurement in human and machine readable format.
 *
 * @param {bigint=} optSince return value of hrtime.bigint().
 * @return {bigint|Object} If argument is defined Object, otherwise
 *    process.hrtime.bigint() return value.
 *    bigint {bigint} The difference represented in nanoseconds.
 *    hr {string} The difference represented in human readable format.
 */
exports.perf = (optSince) => {
  const hrtime = process.hrtime.bigint();
  if (!optSince) {
    return hrtime;
  }
  const diff = hrtime - optSince;
  return exports.perfFormat(diff);
};

/**
 * Will format the difference between two hrtimes in human and machine
 * readable format.
 *
 * @param {bigint} diff The difference to format.
 * @return {Object} Object with the keys:
 *    bigint {bigint} The difference represented in nanoseconds.
 *    hr {string} The difference represented in human readable format.
 */
exports.perfFormat = (diff) => {
  const seconds = diff / BigInt(1e9);
  const totalTime = exports.secondsToDhms(seconds);

  const secondsInMs = seconds * BigInt(1e3);
  const ms = diff / BigInt(1e6) - secondsInMs;
  const msInMis = ms * BigInt(1e3);
  const mis = diff / BigInt(1e3) - secondsInMs - msInMis;

  let hrStr = '';
  if (seconds) {
    hrStr = `${totalTime} ${ms}ms`;
  } else {
    hrStr = `${ms}.${mis}ms`;
  }

  return {
    bigint: diff,
    hr: hrStr,
  };
};

/**
 * Will convert a perf difference to seconds.
 *
 * @param {Object} perfDiff The processed perf object.
 * @return {number}
 */
exports.perfToSeconds = (perfDiff) => {
  const diff = perfDiff.bigint;
  const seconds = diff / BigInt(1e9);
  const secondsInMs = seconds * BigInt(1e3);
  const ms = Number(diff / BigInt(1e6) - secondsInMs);

  const secondsWithMs = Number(seconds) + ms / 1000;
  return secondsWithMs;
};

/**
 * Will shallow copy all key/values from source object to target object,
 * mutates target object.
 *
 * @param {Object} srcObj Source object.
 * @param {Object} trgObj Target object.
 * @param {string=} optPrefix Prefix the keys with this string.
 * @return {void} Mutates "trgObj".
 */
exports.flatCopyObj = (srcObj, trgObj, optPrefix = '') => {
  const keys = Object.keys(srcObj);

  keys.forEach((key) => {
    const targetKey = `${optPrefix}${key}`;
    trgObj[targetKey] = srcObj[key];
  });
};

/**
 * Terminates the application gracefully.
 *
 * @param {number=} exitCode Set to value other than 0 for error exit.
 */
exports.exitApp = async (exitCode = 0) => {
  // Inline require to avoid circular dependency isssue.
  const { dispose } = require('../boot/boot-utils/dispose');

  await dispose();

  process.exit(exitCode);
};

/**
 * Get percentage of fraction into human readable format.
 *
 * @param {number} a Denominator.
 * @param {number} b Numerator.
 * @param {number=} decimals How many decimals to have.
 * @return {string} Human readable percentage.
 */
exports.getPercentHr = (a, b, decimals = 2) => {
  const percent = b / a;
  return `${(percent * 100).toFixed(decimals)}%`;
};

/**
 * Shorten an ethereum address as "0x123..98765".
 *
 * @param {string} address An ethereum address.
 * @return {string}
 */
exports.shortAddress = (address) => {
  return `${address.substring(0, 5)}..${address.substring(37, 42)}`;
};

/**
 * Will safely JSON serialize any value to JSON, accounting for BigInt.
 *
 * @param {*} obj Any value to serialize.
 * @return {string}
 */
exports.safeStringify = (obj) => {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};

/**
 * Convert Unix timestamp to JS Native Date.
 *
 * @param {*} unixTimestamp Unix timestamp.
 * @return {Date} JS Native Date.
 */
exports.unixToJsDate = (unixTimestamp) => {
  return new Date(Number(unixTimestamp) * 1000);
};

/**
 * Fills an array with a range of numbers starting and ending as defined.
 *
 * @param {number} start Number to start from.
 * @param {number} end Number to end.
 * @return {Array<number>}
 */
exports.rangeFill = (start, end) => {
  const diff = end - start;
  const rangeFill = Array(diff)
    .fill('')
    .map((a, index) => start + index);
  rangeFill.push(end);
  return rangeFill;
};

/**
 * Converts seconds to human readable format of days, hours, minutes and seconds.
 *
 * @param {number} seconds Seconds to convert.
 * @param {boolean=} short Short version.
 * @return {string} Formatted string.
 * @see https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
 */
exports.secondsToDhms = (seconds, short = false) => {
  seconds = Number(seconds);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsShow = Math.floor(seconds % 60);

  let dDisplay = days > 0 ? days + (days === 1 ? ' day, ' : ' days, ') : '';
  let hDisplay =
    hours > 0 ? hours + (hours === 1 ? ' hour, ' : ' hours, ') : '';
  let mDisplay =
    minutes > 0 ? minutes + (minutes === 1 ? ' minute, ' : ' minutes, ') : '';
  let sDisplay =
    secondsShow > 0
      ? secondsShow + (secondsShow === 1 ? ' second' : ' seconds')
      : '';

  if (short) {
    dDisplay = days > 0 ? `${days}d:` : '';
    hDisplay = hours > 0 ? `${hours}h:` : '';
    mDisplay = minutes > 0 ? `${minutes}m:` : '';
    sDisplay = secondsShow > 0 ? `${secondsShow}s` : '0';
  }

  return dDisplay + hDisplay + mDisplay + sDisplay;
};

/**
 * Will parse and normalize a human input of comma separated values
 * each item will be trimmed for spaces.
 *
 * @param {string} input The raw human input.
 * @return {Array<string>} Space trimmed values.
 */
exports.humanCSVInputToArray = (input) => {
  const items = input.split(',');
  return items.map((item) => {
    return item.trim();
  });
};

/**
 * Format in human readable format a number.
 *
 * @param {number} num The number to format.
 * @return {string}
 */
exports.formatNumber = (num) => {
  const intl = new Intl.NumberFormat('en-US');
  return intl.format(num);
};
