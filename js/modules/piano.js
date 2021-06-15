import { getCookie } from './cookie';
import {
  dispatchPaymentFormLoaded,
  dispatchPaymentDetailsSuccess,
  dispatchPaymentDetailsFailed,
} from './customEvents';
import { trackSubscriptionCause } from './taboola';

const addHandlers = (trackingData) => {
  window.tp = window.tp || [];

  window.tp.push([
    'addHandler',
    'startCheckout',
    () => dispatchPaymentFormLoaded(trackingData),
  ]);

  window.tp.push([
    'addHandler',
    'checkoutComplete',
    () => {
      dispatchPaymentDetailsSuccess(trackingData);
      trackSubscriptionCause();
    },
  ]);

  window.tp.push([
    'addHandler',
    'checkoutError',
    () => dispatchPaymentDetailsFailed(trackingData),
  ]);
};

export const showPianoOffer = (offerId, termId, trackingDatas) => {
  addHandlers(trackingDatas);

  window.tp = window.tp || [];
  window.tp.push([
    'init',
    function () {
      window.tp.offer.show({
        offerId,
        termId,
      });
    },
  ]);
};

// don't have to use window.tp here as we pass it through in the params
export const startPianoCheckout = (tp, trackingData) => {
  addHandlers(trackingData);

  // This cookie is created from onLoginRequired function in piano embed code
  const paramsCookie = decodeURIComponent(getCookie('__pianoParams'));
  const params = JSON.parse(paramsCookie);
  if (params !== undefined) {
    tp.offer.startCheckout(params);
  } else {
    new Error('params not found');
  }
};
