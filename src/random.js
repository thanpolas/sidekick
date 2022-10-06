/**
 * @fileoverview Randomness related helpers and utilities.
 */

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
