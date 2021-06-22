import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import { subscribeNonLoggedInUser } from './subscribeNonLoggedInUser';
import { subscribeLoggedInUser } from './subscribeLoggedInUser';
import { dispatchCustomEvent } from '../../utils/dispatchCustomEvent';
import { getNewsletterName } from '../../utils/getNewsletterName';

const PIANO_EVENT_LOGGED_IN_NSC_SIGNUP = 'logged-in-nsc-signup';
const PIANO_EVENT_NOT_LOGGED_IN_NSC_SIGNUP = 'non-logged-in-nsc-signup';

function init() {
  window.tp = window.tp || [];
  window.tp.push([
    'addHandler',
    'customEvent',
    (event) => {
      switch (event?.eventName) {
        case PIANO_EVENT_NOT_LOGGED_IN_NSC_SIGNUP:
          subscribeNonLoggedInUser(event);
          break;

        case PIANO_EVENT_LOGGED_IN_NSC_SIGNUP:
          subscribeLoggedInUser(event);

          break;

        default:
        // do nothing
      }
    },
  ]);

  window.addEventListener('message', (event) => {
    const eventName = event?.data?.name || '';
    const newsletter = event?.data?.newsletter || '';

    if (eventName === 'offer-checkbox-checked') {
      dispatchCustomEvent('newsletter_prefs_subscribe', {
        newsletter: getNewsletterName(newsletter),
      });
    } else if (eventName === 'offer-checkbox-unchecked') {
      dispatchCustomEvent('newsletter_prefs_unsubscribe', {
        newsletter: getNewsletterName(newsletter),
      });
    }
  });
}

jsLoader(
  [
    'https://www.google.com/recaptcha/api.js?render=6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm',
  ],
  init,
);
