/**
 * @fileoverview Test formatters.
 */

const sidekick = require('../..');

describe('UNIT format Helpers', () => {
  describe('getPercentDiffHr()', () => {
    test('Should return expected percent difference', () => {
      const target = '64749';
      const compare = '31585';

      const diff = sidekick.getPercentDiffHr(target, compare);
      expect(diff).toBe('-51.22%');
    });
  });
});
