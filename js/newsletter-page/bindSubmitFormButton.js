/*globals grecaptcha */

import { buildRequestBody } from './utils/buildRequestBody';

//  TODO: have this in one place in app and import it
const RECAPTCHA_KEY = '6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm';
const SUBSCRIBE_ACTION = 'subscribeToNewsletters';

const SUBMIT_BUTTON_ID = 'submit-newsletter-form';
const SUBMIT_BUTTON_TEXT_ID = 'submit-newsletter-button-text';
const SHOW_SUCCESS_MESSAGE_DURATION = 5000;
const SERVER_ERROR_MESSAGE = 'An error occurred, please try again later';

export const bindSubmitFormButton = (state) => {
  const submitFormButton = document.getElementById(SUBMIT_BUTTON_ID);
  const buttonText = document.getElementById(SUBMIT_BUTTON_TEXT_ID);

  /*
   *  Event listeners
   */

  submitFormButton.addEventListener('click', async () => {
    if (!state.submittingRequest) {
      state.startRequest();

      const endpointUrl = `/internal-api/newsletter-component/submit/lite?__amp_source_origin=${window.location.origin}`;

      try {
        const token = await grecaptcha.execute(RECAPTCHA_KEY, {
          action: SUBSCRIBE_ACTION,
        });

        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildRequestBody(state, token)),
        });

        if (response.ok) {
          state.onSuccess();

          setTimeout(() => {
            state.hideSuccessMessage();
          }, SHOW_SUCCESS_MESSAGE_DURATION);
        } else {
          throw Error();
        }
      } catch (e) {
        state.onError(SERVER_ERROR_MESSAGE);
      } finally {
        state.endRequest();
      }
    }
  });

  /*
   *  Watchers
   */

  state.watch(
    (data) => data.valid,
    (newValue) => {
      submitFormButton.disabled = !newValue;
    },
  );

  state.watch(
    (data) => data.buttonText,
    (text) => {
      buttonText.textContent = text;
    },
  );

  state.watch(
    (data) => data.submittingRequest,
    (submittingRequest) => {
      if (submittingRequest) {
        submitFormButton.classList.add('is-loading');
      } else {
        submitFormButton.classList.remove('is-loading');
      }
    },
  );
};
