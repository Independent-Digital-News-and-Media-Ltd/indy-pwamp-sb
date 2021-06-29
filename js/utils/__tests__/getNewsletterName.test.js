import { getNewsletterName } from '../getNewsletterName';

describe('getNewsletterName()', () => {
  it('should return Sailthru newsletter name for newsletter key', () => {
    expect(getNewsletterName('receiveIndyHealthNews')).toBe(
      'IND_Health_Newsletter',
    );
    expect(getNewsletterName('receiveIndyOffers')).toBe('IND_Marketing_CDP');
    expect(getNewsletterName('receiveIndyHeadlinesNews')).toBe(
      'IND_Headlines_Masterlist_CDP',
    );
    expect(getNewsletterName('receiveIndyFootballNews')).toBe(
      'IND_Football_CDP',
    );
    expect(getNewsletterName('receiveIndySports')).toBe('IND_SPORTS_CDP');
    expect(getNewsletterName('receiveIndyTravelNews')).toBe(
      'IND_Travel_Newsletter_CDP',
    );
    expect(getNewsletterName('receiveIndyArtsAndEntertainmentNews')).toBe(
      'IND_Culture_Newsletter_CDP',
    );
    expect(getNewsletterName('receiveIndyCompetitionNews')).toBe(
      'IND_Comps_And_Offers_CDP',
    );
    expect(getNewsletterName('receiveIndyBest')).toBe('IND_Indy_Best_CDP');
    expect(getNewsletterName('receiveindylifestyle')).toBe('IND_IndyLife_CDP');
    expect(getNewsletterName('receiveLetter')).toBe('IND_Premium_Letter');
    expect(getNewsletterName('receiveBriefing')).toBe('IND_Premium_Briefing');
    expect(getNewsletterName('receiveBrexit')).toBe('IND_Brexit_CDP');
    expect(getNewsletterName('receiveInsideWashingtonNews')).toBe(
      'IND_INSIDE_WASHINGTON',
    );
    expect(getNewsletterName('receiveTheView')).toBe(
      'IND_VIEW_WESTMINSTER_cdp',
    );
    expect(getNewsletterName('receiveClimate')).toBe('IND_Climate_Newsletter');
  });
});
