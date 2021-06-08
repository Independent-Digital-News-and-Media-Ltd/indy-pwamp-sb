import { buildNewslettersObject } from '../buildNewslettersObject';

describe('buildNewslettersObject()', () => {
  describe('when offers is set', () => {
    it('should create object with newsletter and offers newsletters', () => {
      expect(buildNewslettersObject('foo', true)).toEqual({
        foo: true,
        receiveIndyOffers: true,
      });
    });
  });

  describe('when offers is NOT set', () => {
    it('should create object with newsletter only', () => {
      expect(buildNewslettersObject('foo')).toEqual({
        foo: true,
      });
    });
  });

  describe('when newsletter and offers are NOT set', () => {
    it('should create object with no properties', () => {
      expect(buildNewslettersObject()).toEqual({});
    });
  });
});
