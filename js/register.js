/*globals grecaptcha */

import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import PostCodePatterns from '../../data/PostCodePatterns';

import { getCookie } from './modules/cookie';
import { hasParameter } from './modules/util';
import {
  dispatchRegistrationSuccess,
  dispatchRegistrationFailed,
  dispatchPaymentFormLoaded,
  dispatchPaymentDetailsSuccess,
  dispatchPaymentDetailsFailed,
} from './modules/customEvents';
import {
  getDigitalDataByKeys,
  removeDigitalDataByKeys,
} from './modules/digitalData';

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

const showPassword = document.querySelectorAll('.show-password');
showPassword.forEach((el) => {
  el.addEventListener('click', () => {
    const passwordInput = el.parentElement.querySelector('input');
    if (!passwordInput) return;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      el.text = 'Hide';
    } else {
      passwordInput.type = 'password';
      el.text = 'Show';
    }
  });
});

const country = document.querySelector('#reg-form-country');
const postcode = document.querySelector('#reg-form-postcode');
if (country && postcode) {
  country.addEventListener('change', () => {
    const fieldTerm =
      country.value === 'United States of America' ? 'Zipcode' : 'Postcode';
    const pattern = PostCodePatterns[country.value];

    if (pattern === '^$') {
      postcode.parentElement.style.display = 'none';
      postcode.value = '';
      return;
    }

    postcode.parentElement.style.display = 'block';
    document.querySelector('#reg-form-postcode ~ label').innerHTML = fieldTerm;
    document
      .querySelectorAll('#reg-form-postcode ~ .error-text')
      .forEach((el) => {
        el.innerHTML = `Please enter a valid ${fieldTerm.toLowerCase()}`;
      });
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
  const tp = window.tp || [];

  tp.push([
    'addHandler',
    'startCheckout',
    () => dispatchPaymentFormLoaded(trackingData),
  ]);

  tp.push([
    'addHandler',
    'checkoutComplete',
    () => dispatchPaymentDetailsSuccess(trackingData),
  ]);

  tp.push([
    'addHandler',
    'checkoutError',
    () => dispatchPaymentDetailsFailed(trackingData),
  ]);

  tp.push([
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

  tp.push([
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

  tp.push(['setUserRef', userRef]);

  tp.push([
    'init',
    function () {
      if (tp.user.isUserValid()) {
        // This cookie is created on the selling page
        const paramsCookie = tp.util.findCookieByName('__pianoParams');
        const params = JSON.parse(paramsCookie);

        if (params !== undefined) {
          tp.offer.startCheckout(params);
          shadowBg.classList.add('hide-spinner');
        } else {
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

const loggedInUserCheckout = () => {
  const tp = window.tp || [];

  tp.push([
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

  tp.push([
    'init',
    function () {
      const paramsCookie = decodeURIComponent(getCookie('__pianoParams'));
      const params = JSON.parse(paramsCookie);
      const tp = window.tp || [];
      tp.offer.startCheckout(params);
    },
  ]);
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
