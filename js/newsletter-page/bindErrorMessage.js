const ERROR_CLASS = 'is-error';
const ERROR_MESSAGE_ID = 'error-message';
const INPUT_WIDGET_ID = 'input-widget';

export const bindErrorMessage = (state) => {
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
