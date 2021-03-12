import { buildRequestBody } from '../buildRequestBody';

const TEST_EMAIL = 'rich@dev.com';
const NEWSLETTER_A = 'newsletter-a';
const NEWSLETTER_B = 'newsletter-b';
const GREPTCHA_TOKEN = 'token';

describe('buildRequestBody()', () => {
  describe('when `offers` is false', () => {
    it('should return request body', () => {
      const state = {
        data: {
          offers: false,
          newsletters: {
            intransit: [NEWSLETTER_A, NEWSLETTER_B],
          },
          email: {
            value: TEST_EMAIL,
          },
        },
      };

      expect(buildRequestBody(state, GREPTCHA_TOKEN)).toEqual({
        email: TEST_EMAIL,
        newsletters: [NEWSLETTER_A, NEWSLETTER_B],
        grecaptcha_token: GREPTCHA_TOKEN,
      });
    });
  });

  describe('when `offers` is true', () => {
    it('should return request body with `receiveIndyOffers`', () => {
      const state = {
        data: {
          offers: true,
          newsletters: {
            intransit: [NEWSLETTER_A, NEWSLETTER_B],
          },
          email: {
            value: TEST_EMAIL,
          },
        },
      };

      expect(buildRequestBody(state, GREPTCHA_TOKEN)).toEqual({
        email: TEST_EMAIL,
        newsletters: [NEWSLETTER_A, NEWSLETTER_B, 'receiveIndyOffers'],
        grecaptcha_token: GREPTCHA_TOKEN,
      });
    });
  });
});
