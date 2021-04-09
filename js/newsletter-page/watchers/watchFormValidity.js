import { SUBMIT_BUTTON_ID } from '../constants';

export const watchFormValidity = (state) => {
  const submitFormButton = document.getElementById(SUBMIT_BUTTON_ID);

  state.watch(
    (data) => data.valid,
    (newValue) => {
      submitFormButton.disabled = !newValue;
    },
  );
};
