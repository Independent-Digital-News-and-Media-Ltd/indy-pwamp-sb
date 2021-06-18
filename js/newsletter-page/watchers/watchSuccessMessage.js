import { animateIn, animateOut } from '../utils/animation';
import { SUCCESS_POPUP_ID } from '../constants';

const SUCCESS_POPUP_TEXT_SELECTOR = '.text';

export const watchSuccessMessage = (state) => {
  state.watch(
    (data) => data.successMessage,
    (successMessage, previousValue) => {
      const successPopup = document.getElementById(SUCCESS_POPUP_ID);

      if (successPopup) {
        if (successMessage) {
          successPopup.querySelector(SUCCESS_POPUP_TEXT_SELECTOR).textContent =
            successMessage;

          animateIn(successPopup);
        } else {
          previousValue && animateOut(successPopup);
        }
      }
    },
  );
};
