const CLOSE_SUCCESS_POPUP_SELECTOR = '.success-popup-close';

export const bindSuccessPopup = (state) => {
  const closeSuccessPopupButton = document.querySelector(
    CLOSE_SUCCESS_POPUP_SELECTOR,
  );

  closeSuccessPopupButton.addEventListener('click', () => {
    state.hideSuccessMessage();
  });
};
