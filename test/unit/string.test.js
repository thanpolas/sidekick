/**
 * @fileoverview Test string related util/helpers.
 */

const sidekick = require('../..');

describe('UNIT string Helpers', () => {
  describe('splitString()', () => {
    test('Should return a single item', () => {
      const str = 'one two';
      const ret = sidekick.splitString(str);

      expect(ret).toHaveLength(1);
      expect(ret[0]).toEqual(str);
    });
    test('Should return two items', () => {
      const str = 'one two';
      const ret = sidekick.splitString(str, 4);

      expect(ret).toHaveLength(2);
      expect(ret[0]).toEqual('one ');
      expect(ret[1]).toEqual('two');
    });
  });

  describe('stdQuote()', () => {
    const allQuotes = [
      ['“', 'U+201c'],
      ['”', 'U+201d'],
      ['«', 'U+00AB'],
      ['»', 'U+00BB'],
      ['„', 'U+201E'],
      ['‟', 'U+201F'],
      ['❝', 'U+275D'],
      ['❞', 'U+275E'],
      ['〝', 'U+301D'],
      ['〞', 'U+301E'],
      ['〟', 'U+301F'],
      ['＂', 'U+FF02'],
    ];

    allQuotes.forEach(([altQuote, utfCode]) => {
      test(`Will properly normalize for quote ${altQuote} with UTF Code: ${utfCode}`, () => {
        const str = `A string ${altQuote}with an alt quote${altQuote}`;
        const normalizedStr = sidekick.stdQuote(str);
        expect(normalizedStr).toEqual('A string "with an alt quote"');
      });
    });
  });
});
