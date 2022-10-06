/**
 * @fileoverview Asynchronous function helpers and utilities.
 */

const Bluebird = require('bluebird');

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
