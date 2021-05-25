import { InternalApi } from '../modules/internal-api';
import { sendPostMessageToPiano } from './sendPostMessageToPiano';
import { buildNewslettersObject } from './utils/buildNewslettersObject';
import { dispatchCustomEvent } from '../utils/tracking';
import { getNewsletterName } from '../utils/getNewsletterName';

export const subscribeLoggedInUser = async (event) => {
  const { newsletter, offer, iframeid } = event.params;

  const url = 'newsletter-component/logged-in/update';

  try {
    const response = await InternalApi.post(
      url,
      buildNewslettersObject(newsletter, offer),
    );

    if (response.ok) {
      sendPostMessageToPiano(iframeid, true);
    } else {
      sendPostMessageToPiano(iframeid, false);
    }
  } catch (e) {
    sendPostMessageToPiano(iframeid, false);
  } finally {
    dispatchCustomEvent('newsletter_lite_reg_signup', {
      newsletter: getNewsletterName(newsletter),
    });
  }
};
