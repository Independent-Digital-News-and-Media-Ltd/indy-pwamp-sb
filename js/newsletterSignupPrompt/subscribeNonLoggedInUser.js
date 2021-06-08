/*globals grecaptcha, JSGlobals */
import { InternalApi } from '../modules/internal-api';
import { sendPostMessageToPiano } from './sendPostMessageToPiano';
import { buildNewslettersArray } from './utils/buildNewslettersArray';
import { toErrorCode, ERROR_KEY_UNKNOWN } from './constants';
import { dispatchCustomEvent } from '../utils/tracking';
import { getNewsletterName } from '../utils/getNewsletterName';
import { NewslettersConfig } from '../../../config/newsletters/newslettersConfig';

// TODO: store these in config. Refactor across whole site as there's a few of these
const RECAPTCHA_KEY = '6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm';
const RECAPTCHA_ACTION_SUBMIT = 'submit_lite_register_component';

export const subscribeNonLoggedInUser = async (event) => {
  const { email, newsletter, offer, iframeid } = event.params;

  const url = 'newsletter-component/submit/lite';

  const { article, sections, sectionName } = JSGlobals;

  const regSourceMethod = encodeURIComponent(
    `${article ? 'Article' : 'Section'}+Signpost`,
  );

  const regSourceSection =
    article?.sections?.[0].name ?? sections?.[0].name ?? sectionName ?? 'News';

  const regSourceNewsletter =
    NewslettersConfig['independent.co.uk'][newsletter].regSourceNewsletter;

  try {
    const token = await grecaptcha.execute(RECAPTCHA_KEY, {
      action: RECAPTCHA_ACTION_SUBMIT,
    });

    const response = await InternalApi.post(url, {
      email,
      newsletters: buildNewslettersArray(newsletter, offer),
      grecaptcha_token: token,
      regSourceMethod,
      regSourceSection,
      regSourceNewsletter,
    });

    if (response.ok) {
      sendPostMessageToPiano(iframeid);
    } else {
      const json = await response.json();
      sendPostMessageToPiano(iframeid, false, toErrorCode(json.message));
    }
  } catch (e) {
    sendPostMessageToPiano(iframeid, false, ERROR_KEY_UNKNOWN);
  } finally {
    dispatchCustomEvent('newsletter_lite_reg_signup', {
      newsletter: getNewsletterName(newsletter),
    });
  }
};
