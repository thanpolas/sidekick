/**
 * @fileoverview http related helpers.
 */

/**
 * Return the client's IP from an express request object.
 *
 * @param  {Request} req The request object.
 * @return {string} The client's ip.
 */
exports.getIp = function (req) {
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'].split(',')[0];
  }

  let { ip } = req;
  if (!ip) {
    return '';
  }

  if (ip.includes('::ffff:')) {
    [ip] = ip.split(':').reverse();
  }

  return ip;
};
