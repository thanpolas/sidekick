/**
 * @fileoverview Performance related functions.
 */

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
