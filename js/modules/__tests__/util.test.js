import { hasSpanishBrowserLanguage } from '../util';

describe('when browser language does not include Spanish', () => {
  it('should return false', () => {
    expect(hasSpanishBrowserLanguage(['en'])).toBe(false);
  });
});

describe('when browser language does not include Spanish', () => {
  it('should return false', () => {
    expect(hasSpanishBrowserLanguage(['en', ''])).toBe(false);
  });
});

describe('when browser language includes Spanish', () => {
  it('should return true', () => {
    expect(hasSpanishBrowserLanguage(['ja', 'es'])).toBe(true);
  });
});

describe('when browser language includes Spanish', () => {
  it('should return true', () => {
    expect(hasSpanishBrowserLanguage(['zh', 'en', 'es'])).toBe(true);
  });
});
