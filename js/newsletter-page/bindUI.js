import { bindEmailInputField } from './bindEmailInputField';
import { bindSubmitFormButton } from './bindSubmitFormButton';
import { bindErrorMessage } from './bindErrorMessage';
import { animateIn, animateOut } from './animateInputWidget';

const NEWSLETTER_CHECKBOX_SELECTOR = '.newsletter-page-select-checkbox';
const OFFERS_CHECKBOX_ID = 'receiveIndyOffers';
const CLOSE_SUCCESS_POPUP_SELECTOR = '.success-popup-close';
const SUCCESS_POPUP_TEXT_SELECTOR = '.text';
const SUCCESS_POPUP_ID = 'success-popup';

export const bindUI = (state) => {
  /*
   *  DOM elements
   */

  const checkboxes = document.querySelectorAll(NEWSLETTER_CHECKBOX_SELECTOR);
  const offersCheckbox = document.getElementById(OFFERS_CHECKBOX_ID);
  const closeSuccessPopupButton = document.querySelector(
    CLOSE_SUCCESS_POPUP_SELECTOR,
  );

  function selectNewsletter(event) {
    state.updateSelectedNewsletters(event.target.name, event.target.checked);
  }

  /*
   *  Event listeners
   */

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', selectNewsletter);
  });

  offersCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      state.selectOffers();
    } else {
      state.deselectOffers();
    }
  });

  closeSuccessPopupButton.addEventListener('click', () => {
    state.hideSuccessMessage();
  });

  /*
   *  Watchers
   */

  /*
   *  The UI is 'optimistically' updated - that is to say, we show cards to be in the subscribed state
   *  even before the server has confirmed a successful subscription. If the server throws an error, then
   *  we will rollback.
   */

  state.watch(
    (data) => data.newsletters.intransit,
    (tempSubscribedNewsletters) => {
      tempSubscribedNewsletters.forEach((card) => {
        const cardEl = document.getElementById(card);

        if (cardEl) {
          cardEl.classList.add('subscribed');

          const checkbox = cardEl.querySelector(NEWSLETTER_CHECKBOX_SELECTOR);

          //  deactivate checkbox
          if (checkbox) {
            checkbox.removeEventListener('change', selectNewsletter);
          }
        }
      });
    },
  );

  /*
   *  To handle rolling back after a server error, when we move a newsletter from the `tempSubscribed` array back into the
   *  `selected array`, we remove the `subscribed` class name from it.
   *  (Obviously, newsletters being added to this array after being
   *  selected will not have this class anyway.)
   */

  state.watch(
    (data) => data.newsletters.selected,
    (selectedNewsletters) => {
      selectedNewsletters.forEach((card) => {
        const cardEl = document.getElementById(card);

        if (cardEl) {
          cardEl.classList.remove('subscribed');

          const checkbox = cardEl.querySelector(NEWSLETTER_CHECKBOX_SELECTOR);

          // reactivate checkbox
          if (checkbox) {
            checkbox.addEventListener('change', selectNewsletter);
          }
        }
      });
    },
  );

  state.watch(
    (data) => data.showInputWidget,
    (showInputWidget, previousValue) => {
      const inputWidgetEl = document.getElementById('input-widget');

      if (showInputWidget) {
        animateIn(inputWidgetEl);
      } else {
        // don't run first time
        previousValue && animateOut(inputWidgetEl);
      }
    },
  );

  state.watch(
    (data) => data.successMessage,
    (successMessage, previousValue) => {
      const successPopup = document.getElementById(SUCCESS_POPUP_ID);

      if (successPopup) {
        if (successMessage) {
          successPopup.querySelector(
            SUCCESS_POPUP_TEXT_SELECTOR,
          ).textContent = successMessage;

          animateIn(successPopup);
        } else {
          previousValue && animateOut(successPopup);
        }
      }
    },
  );

  bindEmailInputField(state);
  bindSubmitFormButton(state);
  bindErrorMessage(state);
};
