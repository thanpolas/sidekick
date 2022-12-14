/**
 * @fileoverview Time related helpers.
 */

const { getRandomIntMinMax } = require('./random');

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

  const delayRand = getRandomIntMinMax(0, diff);

  const delay = fromSeconds + delayRand;

  await exports.delay(delay);

  return delay;
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
