/**
 * @fileoverview Date related utilities / helpers.
 */

const format = require('date-fns/format');

/**
 * Formats a date string into human readable, extended format.
 *
 * @param {string} dt ISO8612 format Date.
 * @return {string} Appropriately formated date to be used on call.
 */
exports.formatDate = (dt) => {
  return format(new Date(dt), "eee, do 'of' MMM yyyy 'at' HH:mm OOOO");
};

/**
 * Formats a date string into human readable, short format.
 *
 * @param {string} dt ISO8612 format Date.
 * @return {string} Appropriately formated date.
 */
exports.formatDateShort = (dt) => {
  return format(new Date(dt), 'dd/MMM/yy HH:mm');
};

/**
 * Convert Unix timestamp to JS Native Date.
 *
 * @param {*} unixTimestamp Unix timestamp.
 * @return {Date} JS Native Date.
 */
exports.unixToJsDate = (unixTimestamp) => {
  return new Date(Number(unixTimestamp) * 1000);
};
