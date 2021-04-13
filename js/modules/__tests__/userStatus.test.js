import { articleIsOverOneYearOld } from '../userStatus';

describe('articleIsOverOneYearOld()', () => {
  let today;
  let publishDate;

  beforeEach(() => {
    //  February 12th 2021
    today = new Date(2021, 1, 12);
  });

  describe('when article is NOT over 1 year old', () => {
    it('should return false', () => {
      // February 12th 2020
      publishDate = '2020-02-12T19:50:04Z';

      expect(articleIsOverOneYearOld(today, publishDate)).toBe(false);
    });
  });

  describe('when article is over 1 year old', () => {
    it('should return true', () => {
      // February 11th 2020
      publishDate = '2020-02-11T19:50:04Z';

      expect(articleIsOverOneYearOld(today, publishDate)).toBe(true);
    });
  });

  describe('when publish date is not valid date', () => {
    it('should return false', () => {
      publishDate = null;

      expect(articleIsOverOneYearOld(today, publishDate)).toBe(false);
    });
  });
});
