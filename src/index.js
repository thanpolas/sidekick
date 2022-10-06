/**
 * Sidekick
 * Your sidekick to all your projects! Helpers, utilities and quickies.
 *
 * https://github.com/thanpolas/sidekick
 *
 * Copyright © Thanos Polychronakis
 * LICENSE on /LICENSE file.
 */

const { asyncMapCap, allSettledArray } = require('./async');
const {
  indexArrayToObjectAr,
  indexArrayToObject,
  arrayKeep,
  flatFilter,
  rangeFill,
} = require('./collections');
const { sha256, hashPassword, passwordsMatch } = require('./crypto-hash');
const { fileSha256 } = require('./crypto-sha256-file');
const { encrypt, decrypt } = require('./crypto-symmetric');
const { formatDate, formatDateShort, unixToJsDate } = require('./date');
const { getPercentHr, shortAddress, formatNumber } = require('./format');
const { iterObj, mapObj, flatCopyObj, safeStringify } = require('./object');
const { perf, perfFormat, perfToSeconds } = require('./perf');
const { getRandomInt } = require('./random');
const { splitString, stdQuote, humanCSVInputToArray } = require('./string');
const {
  delay,
  errorDelay,
  delayMs,
  delayRandom,
  secondsToDhms,
} = require('./time');

/**
 * @fileoverview bootstrap and master exporting module.
 */

// Async
exports.asyncMapCap = asyncMapCap;
exports.allSettledArray = allSettledArray;

// Collections
exports.indexArrayToObjectAr = indexArrayToObjectAr;
exports.indexArrayToObject = indexArrayToObject;
exports.arrayKeep = arrayKeep;
exports.flatFilter = flatFilter;
exports.rangeFill = rangeFill;

// Crypto
exports.sha256 = sha256;
exports.hashPassword = hashPassword;
exports.passwordsMatch = passwordsMatch;
exports.fileSha256 = fileSha256;
exports.symmetricEncrypt = encrypt;
exports.symmetricDecrypt = decrypt;

// Formatting
exports.getPercentHr = getPercentHr;
exports.shortAddress = shortAddress;
exports.formatNumber = formatNumber;

// Objects
exports.iterObj = iterObj;
exports.mapObj = mapObj;
exports.flatCopyObj = flatCopyObj;
exports.safeStringify = safeStringify;

// Perf
exports.perf = perf;
exports.perfFormat = perfFormat;
exports.perfToSeconds = perfToSeconds;

// Random
exports.getRandomInt = getRandomInt;

// Strings
exports.splitString = splitString;
exports.stdQuote = stdQuote;
exports.humanCSVInputToArray = humanCSVInputToArray;

// Time
exports.delay = delay;
exports.errorDelay = errorDelay;
exports.delayMs = delayMs;
exports.delayRandom = delayRandom;
exports.secondsToDhms = secondsToDhms;

// Date
exports.formatDate = formatDate;
exports.formatDateShort = formatDateShort;
exports.unixToJsDate = unixToJsDate;
