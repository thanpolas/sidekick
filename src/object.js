/**
 * @fileoverview Object related helpers and utilities.
 */

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
