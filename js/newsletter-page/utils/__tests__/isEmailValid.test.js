import { isEmailValid } from '../isEmailValid';

describe('isEmailValid()', () => {
  it('should return TRUE for valid emails', () => {
    expect(isEmailValid('alpha@independent.co.uk')).toBe(true);
    expect(isEmailValid('alpha@independent.com')).toBe(true);
  });

  it('should return FALSE for invalid emails', () => {
    expect(isEmailValid('alpha.co.uk')).toBe(false);
    expect(isEmailValid('alpha@independent.c')).toBe(false);
  });
});
