/**
 * @fileoverview Collection related helpers and utilities.
 */

const _ = require('lodash');

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
 * Will deep flatten the given array and filter our falsy values.
 *
 * @param {Array<*>} ar Array with items.
 * @return {Array<*>} Flattened and filtered array.
 */
exports.flatFilter = (ar) => {
  return _.flattenDeep(ar).filter((v) => !!v);
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
