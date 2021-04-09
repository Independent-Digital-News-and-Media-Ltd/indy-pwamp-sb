/* globals grecaptcha */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import { getNewsletterName } from './utils/getNewsletterName';
import { dispatchCustomEvent } from './utils/tracking';

const RECAPTCHA_KEY = '6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm';
const RECAPTCHA_EXPIRY = 120000; // captcha expires after 2 mins
// TODO: Recaptcha docs say "Actions may only contain alphanumeric characters and slashes"
// Are underscores allowed?
const RECAPTCHA_ACTION_LOAD = 'load_lite_register_component';
const RECAPTCHA_ACTION_SUBMIT = 'submit_lite_register_component';

const trackButtonClick = (form) => {
  const keyInput = form.querySelector('.newsletter-key');

  if (keyInput) {
    const key = keyInput.value;
    const newsletter = getNewsletterName(key);

    dispatchCustomEvent('newsletter_lite_reg_signup', {
      newsletter,
    });
  }
};

// Self executing function loaded through * index route
(() => {
  const liteRegForm = document.querySelector('#reg-lite-form');
  const acquireCaptchaToken = (action, callback = () => {}) => {
    grecaptcha
      .execute(RECAPTCHA_KEY, {
        action,
      })
      .then((token) => callback(token));
  };

  // If we're on a page with a lite-reg form, then load recaptcha
  if (liteRegForm) {
    const submit = liteRegForm.querySelector('.form-submit');

    // Event listener will cache captcha status, also resets token on submission
    submit.addEventListener('click', () => {
      if (!window.recentCaptcha) {
        acquireCaptchaToken(RECAPTCHA_ACTION_SUBMIT, (token) => {
          window.recentCaptcha = true;
          setTimeout(() => {
            window.recentCaptcha = false;
          }, RECAPTCHA_EXPIRY);

          document.querySelector('.grecaptcha_token').value = token;
          submit.click();
        });
      } else {
        // Safe to do things here that will only run once per form submission
        trackButtonClick(liteRegForm);
      }
    });

    // Load recaptcha api library
    // assign a token to the relevant form inputs
    jsLoader(
      [`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`],
      () => {
        grecaptcha.ready(() => {
          acquireCaptchaToken(RECAPTCHA_ACTION_LOAD, (token) => {
            document.querySelector('.grecaptcha_token').value = token;
            document.querySelector('.grecaptcha-badge').style.display = 'none';
          });
        });
      },
    );
  } // ENDIF
})();
