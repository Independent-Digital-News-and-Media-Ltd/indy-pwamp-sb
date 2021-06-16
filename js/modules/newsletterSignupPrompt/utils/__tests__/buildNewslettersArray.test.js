import { buildNewslettersArray } from '../buildNewslettersArray';

describe('buildNewslettersArray()', () => {
  describe('when offers is set', () => {
    it('should create array with newsletter and offers newsletters', () => {
      expect(buildNewslettersArray('foo', true)).toEqual([
        'foo',
        'receiveIndyOffers',
      ]);
    });
  });

  describe('when offers is NOT set', () => {
    it('should create array with newsletter only', () => {
      expect(buildNewslettersArray('foo')).toEqual(['foo']);
    });
  });

  describe('when newsletter and offers are NOT set', () => {
    it('should create empty array', () => {
      expect(buildNewslettersArray()).toEqual([]);
    });
  });
});
