import { buildNewsletterTrackingArray } from '../buildNewsletterTrackingArray';

describe('buildNewsletterTrackingArray()', () => {
  it('should return comma separated list of newsletters as string', () => {
    const newsletterKeys = ['receiveIndyFootballNews', 'receiveIndySports'];

    const result = buildNewsletterTrackingArray(newsletterKeys);

    expect(result).toEqual('IND_Football_CDP,IND_SPORTS_CDP');
  });

  it('should ignore unknown keys', () => {
    const newsletterKeys = [
      'receiveIndyFootballNews',
      'foobar',
      'receiveIndySports',
    ];

    const result = buildNewsletterTrackingArray(newsletterKeys);

    expect(result).toEqual('IND_Football_CDP,IND_SPORTS_CDP');
  });
});
