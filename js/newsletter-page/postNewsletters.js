/*globals grecaptcha */
import { buildRequestBody } from './utils/buildRequestBody';
import { InternalApi } from '../modules/internal-api';

//  TODO: have this in one place in app and import it
const RECAPTCHA_KEY = '6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm';
const SUBSCRIBE_ACTION = 'subscribeToNewsletters';
const SHOW_SUCCESS_MESSAGE_DURATION = 5000;
export const SERVER_ERROR_MESSAGE = 'An error occurred, please try again later';

export const postNewsletters = async (state) => {
  if (!state.submittingRequest) {
    state.startRequest();

    try {
      const token = await grecaptcha.execute(RECAPTCHA_KEY, {
        action: SUBSCRIBE_ACTION,
      });

      const response = await InternalApi.post(
        'newsletter-component/submit/lite',
        buildRequestBody(state, token),
      );

      if (response.ok) {
        state.onSuccess();

        setTimeout(() => {
          state.hideSuccessMessage();
        }, SHOW_SUCCESS_MESSAGE_DURATION);
      } else {
        const responseData = JSON.parse(await response.text());
        state.onError(responseData.message);
      }
    } catch {
      state.onError(SERVER_ERROR_MESSAGE);
    } finally {
      state.endRequest();
    }
  }
};
