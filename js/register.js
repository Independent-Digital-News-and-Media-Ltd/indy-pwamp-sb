/*globals grecaptcha */

import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import { getCookie } from './modules/cookie';
import { hasParameter } from './modules/util';
import {
  dispatchRegistrationSuccess,
  dispatchRegistrationFailed,
} from './modules/customEvents';
import {
  getDigitalDataByKeys,
  removeDigitalDataByKeys,
} from './modules/digitalData';

import { startPianoCheckout } from './modules/piano';

const form = document.querySelector('#reg-form');
const submit = form.querySelector('.form-submit');
const shadowBg = document.querySelector('#reg-form ~ .shadow');
const offerCheckBox = document.getElementById('form-receive-offer');

const expandBtn = document.querySelector('#expand-benefits');
if (expandBtn) {
  expandBtn.addEventListener('click', () => {
    document
      .querySelector('#expand-benefits')
      .parentElement.classList.toggle('toggle-benefits');
  });
}

const trackingKeys = [
  'subscription_length',
  'subscription_price',
  'subscription_package',
];
const trackingData = getDigitalDataByKeys(trackingKeys);
setTimeout(() => {
  trackingData && removeDigitalDataByKeys(trackingKeys);
}, 3000);

const startCheckout = (userRef) => {
  window.tp = window.tp || [];

  window.tp.push([
    'addHandler',
    'checkoutStateChange',
    (stateView) => {
      switch (stateView.stateName) {
        // 3 more cases here 'state2', 'bankSecure' and 'receipt':
        case 'confirmation':
          Object.assign(window.digitalData, trackingData);
          break;
      }
    },
  ]);

  window.tp.push([
    'addHandler',
    'customEvent',
    function (e) {
      if (e && e.eventName) {
        switch (e.eventName) {
          case 'close-subscribe-payment':
            window.location = '/subscribe';
            break;
          case 'close-subscribe-donation':
            window.location = '/donations';
            break;
          case 'close-subscribe-election':
            window.location = '/subscribe/election';
            break;
        }
      }
    },
  ]);

  window.tp.push(['setUserRef', userRef]);

  window.tp.push([
    'init',
    function () {
      if (window.tp.user.isUserValid()) {
        try {
          startPianoCheckout(window.tp, trackingData);
        } catch (error) {
          shadowBg.classList.remove('show');
          document.querySelector('.piano-form-error').innerHTML =
            'This page has expired due to inactivity, please return to the <a href="/subscribe">subscribe</a> page and start the checkout again.';
        }
      }
    },
  ]);
};

submit.addEventListener('click', (event) => {
  if (!window.recentCaptcha) {
    event.preventDefault();
    grecaptcha
      .execute('6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm', {
        action: 'submit_register_form',
      })
      .then((token) => {
        document.querySelector('.grecaptcha_token').value = token;
        window.recentCaptcha = true;
        // captcha expires after 2 mins
        setTimeout(() => {
          window.recentCaptcha = false;
        }, 110000);
        submit.click();
      });
  } else if (form.checkValidity()) {
    shadowBg.classList.add('show');
    const waitResponse = setInterval(() => {
      if (form.classList.contains('amp-form-submit-success')) {
        const userRef = document.querySelector('.userref-response');
        if (userRef && userRef.value) {
          dispatchRegistrationSuccess({
            marketing_opt_in: offerCheckBox.checked,
            ...trackingData,
          });
          form.dispatchEvent(
            new CustomEvent('registrationSuccess', {
              detail: { userRef: userRef.value },
            }),
          );
          shadowBg.classList.remove('show');
          clearInterval(waitResponse);
        }
      } else if (
        form.classList.contains('user-invalid') ||
        form.classList.contains('amp-form-submit-error')
      ) {
        form.dispatchEvent(new Event('registrationError'));
        window.recentCaptcha = false;
        shadowBg.classList.remove('show');
        clearInterval(waitResponse);
      }
    }, 300);
  } else {
    const registrationForm = document.getElementById('reg-form');

    if (registrationForm) {
      const textInputs = registrationForm.querySelectorAll('input, select');
      textInputs.forEach((textInput) => {
        textInput.classList.add('form-submitted');
      });
    }
  }
});

form.addEventListener('registrationError', function () {
  window.hj && window.hj('formSubmitFailed');

  dispatchRegistrationFailed();
});

form.addEventListener('registrationSuccess', function (event) {
  window.hj && window.hj('formSubmitSuccessful');
  const userRef = event.detail.userRef;

  if (userRef === '_none') {
    const query =
      form.elements['premium']?.value === 'true'
        ? '?premium'
        : form.elements['donation']?.value === 'true'
        ? '?donation'
        : '';
    window.location.href = '/thank-you' + query;
  } else {
    startCheckout(userRef);
  }
});

// this code may be obsolete, see message below
const loggedInUserCheckout = () => {
  window.tp = window.tp || [];

  window.tp.push([
    'addHandler',
    'customEvent',
    function (e) {
      if (e && e.eventName) {
        switch (e.eventName) {
          // external event in piano "checkout template" to redirect to subscribe page if checkout closed
          case 'close-subscribe-payment':
            window.location = '/subscribe';
            break;
          case 'close-subscribe-donation':
            window.location = '/donations';
            break;
          // external event in piano "already has access" to redirect to home page once closed
          case 'close-has-access':
            window.location = '/';
            break;
        }
      }
    },
  ]);

  window.tp.push(['init', () => startPianoCheckout(window.tp, trackingData)]);
};

if (hasParameter('premium') || hasParameter('donations')) {
  window.tp = window.tp || [];
  window.tp.push([
    'addHandler',
    'checkoutComplete',
    () => {
      fetch('/subscriber/check-access').catch(() =>
        console.error('Unable to complete subscription check.'),
      );
    },
  ]);

  if (getCookie('loggedIn')) {
    loggedInUserCheckout();
  }
}

const createCaptchaToken = () => {
  grecaptcha.ready(() => {
    grecaptcha
      .execute('6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm', {
        action: 'load_register_page',
      })
      .then((token) => {
        document.querySelector('.grecaptcha_token').value = token;
      });
    document.querySelector('.grecaptcha-badge').style.bottom = '34px';
  });
};

jsLoader(
  [
    'https://www.google.com/recaptcha/api.js?render=6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm',
  ],
  createCaptchaToken,
);
