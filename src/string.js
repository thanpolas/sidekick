/**
 * @fileoverview String related helpers and utilities.
 */

/**
 * Will split a string based on its length using numChars or the default value
 * of 1800 which is intented for spliting long discord messages (limit at 2000).
 *
 * @param {string} str The string to split.
 * @param {number=} [numChars=1800] Number of characters to split the string into.
 * @return {Array<string>} An array of strings, split based on the numChars.
 */
exports.splitString = (str, numChars = 1800) => {
  if (!str) {
    return str;
  }
  const ret = [];
  let offset = 0;
  while (offset < str.length) {
    ret.push(str.substring(offset, numChars + offset));
    offset += numChars;
  }

  return ret;
};

/**
 * Will normalize quotes in a given string. There are many variations of quotes
 * in the unicode character set, this function attempts to convert any variation
 * of quote to the standard Quotation Mark - U+0022 Standard Universal: "
 *
 * @param {string} str The string to normalize
 * @return {string} Normalized string.
 * @see https://unicode-table.com/en/sets/quotation-marks/
 */
exports.stdQuote = (str) => {
  const allQuotes = [
    '“', // U+201c
    '«', // U+00AB
    '»', // U+00BB
    '„', // U+201E
    '“', // U+201C
    '‟', // U+201F
    '”', // U+201D
    '❝', // U+275D
    '❞', // U+275E
    '〝', // U+301D
    '〞', // U+301E
    '〟', // U+301F
    '＂', // U+FF02
  ];
  const stdQuote = '"'; // U+0022

  const normalized = allQuotes.reduce((strNorm, quoteChar) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const re = new RegExp(quoteChar, 'g');
    return strNorm.replace(re, stdQuote);
  }, str);

  return normalized;
};

/**
 * Will parse and normalize a human input of comma separated values
 * each item will be trimmed for spaces.
 *
 * @param {string} input The raw human input.
 * @return {Array<string>} Space trimmed values.
 */
exports.humanCSVInputToArray = (input) => {
  const items = input.split(',');
  return items.map((item) => {
    return item.trim();
  });
};

/**
 * Will render to string array fragments, used for joining discord or CLI
 * messages.
 *
 * By default it returns a string for discord, using bold notation, to cancel
 * that effect set the "isCli" argument to true.
 *
 * @param {Array} heroParts The hero parts to render.
 * @param {boolean=} isCli Set to true to render for CLI.
 * @return {string} Text representation of hero.
 */
exports.renderParts = (heroParts, isCli) => {
  const heroPartsString = heroParts.map((currentPart) => {
    if (Array.isArray(currentPart)) {
      const [label, value] = currentPart;
      return `${exports._applyDiscordBold(label, isCli)}: ${value}`;
    }

    return exports._applyDiscordBold(currentPart, isCli);
  });

  const heroStr = heroPartsString.join(' - ');
  return heroStr;
};

/**
 * Make a value be bold in discord or just return the value if on CLI mode.
 *
 * @param {string} value The value to bold.
 * @param {boolean} isCli If the value is intended for CLI, do not apply bold.
 * @return {string} The value with bold.
 * @private
 */
exports._applyDiscordBold = (value, isCli) => {
  if (isCli) {
    return value;
  }

  return `**${value}**`;
};
