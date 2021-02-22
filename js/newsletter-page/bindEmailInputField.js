import { isEmailValid } from './utils/isEmailValid';

const IS_DIRTY = 'is-dirty';
const IS_PRISTINE = 'is-pristine';
const IS_TOUCHED = 'is-touched';
const IS_UNTOUCHED = 'is-untouched';
const IS_VALID = 'is-valid';
const IS_INVALID = 'is-invalid';

const EMAIL_INPUT_FIELD_ID = 'email-input-field';

export const bindEmailInputField = (state) => {
  const emailInputField = document.getElementById(EMAIL_INPUT_FIELD_ID);

  /*
   *  Event listeners
   */

  emailInputField.addEventListener('blur', () => {
    state.markEmailFieldTouched();
  });

  emailInputField.addEventListener('change', () => {
    state.markEmailFieldDirty();
  });

  emailInputField.addEventListener('input', (event) => {
    const value = event.target.value;
    state.setEmail(value, isEmailValid(value));
  });

  /*
   *  Watchers
   */

  state.watch(
    (data) => {
      return data.email.dirty;
    },
    (newValue) => {
      if (newValue) {
        emailInputField.classList.add(IS_DIRTY);
        emailInputField.classList.remove(IS_PRISTINE);
      } else {
        emailInputField.classList.remove(IS_DIRTY);
        emailInputField.classList.add(IS_PRISTINE);
      }
    },
  );

  state.watch(
    (data) => {
      return data.email.touched;
    },
    (newValue) => {
      if (newValue) {
        emailInputField.classList.add(IS_TOUCHED);
        emailInputField.classList.remove(IS_UNTOUCHED);
      } else {
        emailInputField.classList.remove(IS_TOUCHED);
        emailInputField.classList.add(IS_UNTOUCHED);
      }
    },
  );

  state.watch(
    (data) => {
      return data.email.valid;
    },
    (newValue) => {
      if (newValue) {
        emailInputField.classList.add(IS_VALID);
        emailInputField.classList.remove(IS_INVALID);
      } else {
        emailInputField.classList.remove(IS_VALID);
        emailInputField.classList.add(IS_INVALID);
      }
    },
  );
};
