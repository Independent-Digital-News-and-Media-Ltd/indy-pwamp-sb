import { articleIsOverOneYearOld } from '../userStatus';
import MockDate from 'mockdate';

describe('articleIsOverOneYearOld()', () => {
  let publishDate;

  beforeEach(() => {
    MockDate.set(new Date('2021-02-12T18:50:04Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('when article is NOT over 1 year old', () => {
    it('should return false', () => {
      // February 12th 2020
      publishDate = '2020-02-12T19:50:04Z';

      expect(articleIsOverOneYearOld(publishDate)).toBe(false);
    });
  });

  describe('when article is over 1 year old', () => {
    it('should return true', () => {
      // February 11th 2020
      publishDate = '2020-02-11T19:50:04Z';

      expect(articleIsOverOneYearOld(publishDate)).toBe(true);
    });
  });

  describe('when publish date is not valid date', () => {
    it('should return false', () => {
      publishDate = null;

      expect(articleIsOverOneYearOld(publishDate)).toBe(false);
    });
  });
});
