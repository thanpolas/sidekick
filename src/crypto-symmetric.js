/**
 * @fileoverview Generic Symmetric encryption helpers utilities.
 * @see https://hotsource.dev/2019/08/20/encrypting-text-using-aes-cbc-in-nodejs/
 * @see https://gist.github.com/perry-mitchell/bd6ece1739f4d2324084b0fe07c8be60
 */

const crypto = require('crypto');
const { promisify } = require('util');

const pbkdf2 = promisify(crypto.pbkdf2);

/** @type {number} For AES, this is always 16 */
const IV_LENGTH = 16;
/** @type {string} AES CBC is the strongest symmetric available */
const CIPHER = 'aes-256-cbc';
/** @type {number} how many itterations to run the hash algo */
const HASH_ITTERATIONS = 30000;
/** @type {number} Expected size of the salt for the enc key hash */
const HASH_SALT_SIZE = 32;
/** @type {number} Length of HMAC key */
const HMAC_KEY_SIZE = 32;
/** @type {number} Size of encryption key to use for AES256 CBC cipher */
const PASSWORD_KEY_SIZE = 32;

/**
 * Symmetrically encrypt using AES 256 CBC cipher with a random iv.
 *
 * This function returns a custom string which combines the IV and the
 * encrypted text.
 *
 * @param {string} text Text to encrypt.
 * @param {string} encKey Key to use for encrypting.
 * @param {string=} optPassword Optionally provide user defined password
 *    to use in combination with the encryption key.
 * @return {Promise<string>} Encrypted text combined with IV and salts.
 */
exports.encrypt = async (text, encKey, optPassword) => {
  const iv = await exports.generateIv();
  const salt = await exports.generateSalt(HASH_SALT_SIZE);
  const { derivedKeyBuffer, hmac } = await exports.deriveFromPassword(
    encKey,
    salt,
    optPassword,
  );

  const ivHex = iv.toString('hex');

  const encryptTool = crypto.createCipheriv(CIPHER, derivedKeyBuffer, iv);
  const hmacTool = crypto.createHmac('sha256', hmac);

  // Perform encryption
  let encryptedContent = encryptTool.update(text, 'utf8', 'base64');

  encryptedContent += encryptTool.final('base64');

  // Generate hmac
  hmacTool.update(encryptedContent);
  hmacTool.update(ivHex);
  hmacTool.update(salt);
  const hmacHex = hmacTool.digest('hex');

  // Output encrypted components
  const output = `${hmacHex}:${ivHex}:${salt}:${encryptedContent}`;

  return output;
};

/**
 * Symmetrically decrypt using AES 256 CBC cipher with a random iv.
 *
 * This function returns a custom string which combines the IV and the
 * encrypted text.
 *
 * @param {string} encPackage The encryption package.
 * @param {string} encKey Key to use for encrypting.
 * @param {string=} optPassword Optionally provide user defined password
 *    to use in combination with the encryption key.
 * @return {Promise<string>} Decrypted message.
 * @throws {Error} when decryption fails.
 */
exports.decrypt = async (encPackage, encKey, optPassword) => {
  const [hmacHex, ivHex, salt, encText] = encPackage.split(':');
  const { derivedKeyBuffer, hmac } = await exports.deriveFromPassword(
    encKey,
    salt,
    optPassword,
  );
  const iv = Buffer.from(ivHex, 'hex');

  // Get HMAC tool
  const hmacTool = crypto.createHmac('sha256', hmac);

  // Generate the HMAC
  hmacTool.update(encText);
  hmacTool.update(ivHex);
  hmacTool.update(salt);
  const newHmacHex = hmacTool.digest('hex');
  // Check hmac for tampering
  if (hmacHex.length !== newHmacHex.length) {
    throw new Error('Decryption failed - HMAC tampered');
  }
  if (
    crypto.timingSafeEqual(Buffer.from(hmacHex), Buffer.from(newHmacHex)) !==
    true
  ) {
    throw new Error('Decryption failed');
  }
  // Decrypt
  const decryptTool = crypto.createDecipheriv(CIPHER, derivedKeyBuffer, iv);
  const decryptedText = decryptTool.update(encText, 'base64', 'utf8');

  return `${decryptedText}${decryptTool.final('utf8')}`;
};

/**
 * Hash the encryption key so it is a fixed 32 char length and
 * cryptographically secure.
 *
 * @param {string} key The encryption key to hash.
 * @param {string} salt Used as salt.
 * @param {string=} optPassword Optionally provide user defined password
 *    to use in combination with the encryption key.
 * @return {Promise<Object>} Result containing the key and the hmac to use.
 */
exports.deriveFromPassword = async (key, salt, optPassword) => {
  let password = key;
  if (optPassword) {
    password += optPassword;
  }

  const bits = PASSWORD_KEY_SIZE + HMAC_KEY_SIZE;

  const derivedKey = await pbkdf2(
    password,
    salt,
    HASH_ITTERATIONS,
    bits,
    'sha256',
  );

  const derivedKeyHex = derivedKey.toString('hex');

  const dkhLength = derivedKeyHex.length;
  const keyBuffer = Buffer.from(derivedKeyHex.substr(0, dkhLength / 2), 'hex');
  const output = {
    derivedKeyBuffer: keyBuffer,
    hmac: Buffer.from(
      derivedKeyHex.substring(dkhLength / 2, dkhLength / 2),
      'hex',
    ),
  };
  return output;
};

/**
 * Get a random IV asynchronously.
 *
 * @return {Promise<Buffer>} A buffer to be used as IV.
 */
exports.generateIv = async () => {
  return Buffer.from(crypto.randomBytes(IV_LENGTH));
};

/**
 * Generate a random salt for the hashing algorithm.
 *
 * @param {number} length Length of the salt.
 * @return {Promise<string>} The salt to use.
 */
exports.generateSalt = async (length) => {
  let output = '';
  while (output.length < length) {
    output += crypto.randomBytes(3).toString('base64');
    if (output.length > length) {
      output = output.substring(0, length);
    }
  }

  return output;
};
