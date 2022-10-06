/**
 * @fileoverview Randomness related helpers and utilities.
 */

const { default: slugify } = require('slugify');

/**
 * Returns a random number from "min" value up to "max" value.
 *
 * @param {number} min Minimum random number to return.
 * @param {number} max Maximum random number to return.
 * @return {number} A random integer number.
 */
exports.getRandomIntMinMax = (min, max) => {
  // find diff
  const difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand += min;

  return rand;
};

/**
 * Produce a unique id on demand.
 *
 * @param {string=} part Any arbitrary id to prefix the id with.
 * @return {string}
 */
exports.getUniqueId = (part) => {
  const nowTs = Date.now();
  const randomNumber = exports.getRandomIntMinMax(100000, 999999);

  const prefix = part ? `${part}-` : '';

  const idParts = `${prefix}${nowTs}-${randomNumber}`;
  const id = slugify(idParts, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: 'en', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });

  return id;
};
