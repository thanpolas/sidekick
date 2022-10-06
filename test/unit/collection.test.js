/**
 * @fileoverview Test string related util/helpers.
 */

const sidekick = require('../..');

describe('UNIT string Helpers', () => {
  describe('indexArrayToObject', () => {
    test('Should properly index an array', () => {
      const testAr = [
        { id: 1, name: 'thanos' },
        { id: 2, name: 'watchit' },
      ];
      const indexedObj = sidekick.indexArrayToObject(testAr, 'name');

      expect(indexedObj).toBeObject();
      expect(indexedObj).toContainAllKeys(['thanos', 'watchit']);
      expect(indexedObj.thanos).toContainAllKeys(['id', 'name']);
      expect(indexedObj.thanos.id).toEqual(1);
      expect(indexedObj.thanos.name).toEqual('thanos');
    });
  });
  describe('indexArrayToObjectAr', () => {
    test('Should properly index an array', () => {
      const testAr = [
        { id: 1, name: 'thanos' },
        { id: 2, name: 'watchit' },
        { id: 3, name: 'watchit' },
      ];
      const indexedObj = sidekick.indexArrayToObjectAr(testAr, 'name');

      expect(indexedObj).toBeObject();
      expect(indexedObj).toContainAllKeys(['thanos', 'watchit']);
      expect(indexedObj.thanos).toBeArray();
      expect(indexedObj.thanos).toHaveLength(1);
      expect(indexedObj.thanos[0]).toContainAllKeys(['id', 'name']);
      expect(indexedObj.thanos[0].id).toEqual(1);
      expect(indexedObj.thanos[0].name).toEqual('thanos');

      expect(indexedObj.watchit).toBeArray();
      expect(indexedObj.watchit).toHaveLength(2);
      expect(indexedObj.watchit[0]).toContainAllKeys(['id', 'name']);
      expect(indexedObj.watchit[0].id).toEqual(2);
      expect(indexedObj.watchit[0].name).toEqual('watchit');
      expect(indexedObj.watchit[1].id).toEqual(3);
      expect(indexedObj.watchit[1].name).toEqual('watchit');
    });
  });
});
