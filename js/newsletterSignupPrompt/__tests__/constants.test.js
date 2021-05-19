import { FORM_ERROR_MESSAGE_ALREADY_SIGNED_UP } from '../../../../constants/formErrorMessages';
import {
  toErrorCode,
  ERROR_KEY_EXISTING_EMAIL,
  ERROR_KEY_UNKNOWN,
} from '../constants';

describe('toErrorCode()', () => {
  describe('when argument is for already signed up error message', () => {
    it('should return key denoting existing email error', () => {
      expect(toErrorCode(FORM_ERROR_MESSAGE_ALREADY_SIGNED_UP)).toBe(
        ERROR_KEY_EXISTING_EMAIL,
      );
    });
  });

  describe('when argument is anything else', () => {
    it('should return key denoting unknown error', () => {
      expect(toErrorCode('sfs')).toBe(ERROR_KEY_UNKNOWN);
    });
  });
});
