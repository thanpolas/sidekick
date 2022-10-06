/**
 * @fileoverview Formatting functions and helpers.
 */

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
 * Format in human readable format a number.
 *
 * @param {number} num The number to format.
 * @return {string}
 */
exports.formatNumber = (num) => {
  const intl = new Intl.NumberFormat('en-US');
  return intl.format(num);
};
