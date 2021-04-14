import { INPUT_WIDGET_ID, ERROR_MESSAGE_ID } from '../constants';

export const ERROR_CLASS = 'is-error';

export const watchErrorMessage = (state) => {
  const errorMessage = document.getElementById(ERROR_MESSAGE_ID);
  const inputWidget = document.getElementById(INPUT_WIDGET_ID);

  state.watch(
    (data) => data.errorMessage,
    (newValue) => {
      errorMessage.textContent = newValue;

      if (newValue) {
        inputWidget.classList.add(ERROR_CLASS);
      } else {
        inputWidget.classList.remove(ERROR_CLASS);
      }
    },
  );
};
