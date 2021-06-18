import { COOKIE_OPT_IN_LANGUAGE } from '../../../constants/cookies';
import { hasSpanishBrowserLanguage } from './util';
import { hasCookie, setCookie } from './cookie';

const PIANO_EVENT_KEEP_SPANISH = 'keep-spanish';
const PIANO_EVENT_KEEP_ENGLISH = 'keep-english';

const spanishRedirect = () => {
  let tag = '';
  window.tp = window.tp || [];

  if (
    hasSpanishBrowserLanguage(window.navigator.languages) &&
    !hasCookie(COOKIE_OPT_IN_LANGUAGE)
  ) {
    tag = 'show-opt-in-es-prompt';
    window.tp.push([
      'addHandler',
      'customEvent',
      (event) => {
        switch (event?.eventName) {
          case PIANO_EVENT_KEEP_SPANISH:
            setCookie(COOKIE_OPT_IN_LANGUAGE, 'Spanish', 90);
            window.location.reload();
            break;

          case PIANO_EVENT_KEEP_ENGLISH:
            setCookie(COOKIE_OPT_IN_LANGUAGE, 'English', 90);
            break;

          default:
          // do nothing
        }
      },
    ]);
  }
  return tag;
};
export default spanishRedirect;
