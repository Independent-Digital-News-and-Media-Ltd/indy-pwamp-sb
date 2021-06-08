import { SUBMIT_BUTTON_TEXT_ID } from '../constants';

export const watchButtonText = (state) => {
  const buttonText = document.getElementById(SUBMIT_BUTTON_TEXT_ID);

  state.watch(
    (data) => data.buttonText,
    (text) => {
      buttonText.textContent = text;
    },
  );
};
