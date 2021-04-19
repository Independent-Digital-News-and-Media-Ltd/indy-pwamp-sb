import { FORM_ERROR_MESSAGE_ALREADY_SIGNED_UP } from '../../../constants/formErrorMessages';

export const ERROR_KEY_UNKNOWN = 'unknown_error';
export const ERROR_KEY_EXISTING_EMAIL = 'existing_email_error';

/*
 *  There are two reasons we don't want to send the actual error message to Piano:
 *  1. For security - the string will be displayed so we don't want malicious code to be injected
 *  2. It allows the text of the message to be configured in Piano
 */

export const toErrorCode = (errorMessage) => {
  switch (errorMessage) {
    case FORM_ERROR_MESSAGE_ALREADY_SIGNED_UP:
      return ERROR_KEY_EXISTING_EMAIL;
    default:
      return ERROR_KEY_UNKNOWN;
  }
};
