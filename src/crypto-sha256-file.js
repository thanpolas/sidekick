/**
 * @fileoverview Generic SHA256 checksum for filesystem objects.
 */

const fs = require('fs');
const crypto = require('crypto');

/**
 * Will produce the SHA256 checksum of a filesystem object.
 *
 * @param {string} absPath Absolute path to the file.
 * @param {boolean=} base64 Set to true for base64 encoding.
 * @return {Promise<string>} A Promise with the SHA256.
 */
exports.fileSha256 = async (absPath, base64 = false) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fd = fs.createReadStream(absPath);

    const hash = crypto.createHash('sha256');
    if (base64 === true) {
      hash.setEncoding('base64');
    } else {
      hash.setEncoding('hex');
    }

    fd.on('end', () => {
      hash.end();
      resolve(hash.read());
    });
    fd.on('error', (error) => {
      reject(error);
    });

    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);
  });
};
