/**
 * @fileoverview Hashing algorithms.
 */

const crypto = require('crypto');
const util = require('util');

const scryptAsync = util.promisify(crypto.scrypt);
const randomBytesAsync = util.promisify(crypto.randomBytes);

/**
 * Produce globally compatible hash
 *
 * @param {string} data Data to produce hash for.
 * @return {string} Hash of the string.
 * @see https://stackoverflow.com/questions/5878682/node-js-hash-string
 */
exports.sha256 = (data) => {
  return crypto.createHash('sha256').update(data, 'binary').digest('base64');
};

/**
 * Hash encrypt the provided string.
 *
 * @param {string} password The password to hash.
 * @param {string=} optSalt Optionally, provide the salt to use, if not provided
 *    a salt will be generated.
 * @return {Promise<Object>} Object with two keys:
 *   "salt" A string containing the salt.
 *   "hash" A string containing the encrypted password.
 */
exports.hashPassword = async (password, optSalt) => {
  let salt;

  if (optSalt) {
    salt = optSalt;
  } else {
    const saltBuf = await randomBytesAsync(100);
    salt = saltBuf.toString('hex');
  }

  const hashedPassword = await scryptAsync(password, salt, 64);

  return {
    salt,
    hash: hashedPassword.toString('hex'),
  };
};

/**
 * Performs the password matching operation.
 *
 * @param {string} password Password to match.
 * @param {string} encPass Encrypted password from the database.
 * @param {string} salt Salt used to encrypt.
 * @return {Promise<boolean>} A Promise with a boolean response.
 */
exports.passwordsMatch = async (password, encPass, salt) => {
  try {
    const hashedPassword = await exports.hashPassword(password, salt);
    return hashedPassword.hash === encPass;
  } catch (error) {
    return false;
  }
};
