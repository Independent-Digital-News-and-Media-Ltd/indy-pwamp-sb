import { isEmailValid } from '../utils/isEmailValid';

import { EMAIL_INPUT_FIELD_ID } from '../constants';

export const bindEmailInputField = (state) => {
  const emailInputField = document.getElementById(EMAIL_INPUT_FIELD_ID);

  emailInputField.addEventListener('blur', () => {
    state.markEmailFieldTouched();
  });

  emailInputField.addEventListener('change', () => {
    state.markEmailFieldDirty();
  });

  emailInputField.addEventListener('input', (event) => {
    const value = event?.target?.value;
    state.setEmail(value, isEmailValid(value));
  });
};
