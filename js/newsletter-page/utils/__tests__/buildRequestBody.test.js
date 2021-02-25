import { buildRequestBody } from '../buildRequestBody';

describe('buildRequestBody()', () => {
  it('should return request body', () => {
    const TEST_EMAIL = 'rich@dev.com';
    const NEWSLETTER_A = 'newsletter-a';
    const NEWSLETTER_B = 'newsletter-b';
    const GREPTCHA_TOKEN = 'token';

    const state = {
      data: {
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
