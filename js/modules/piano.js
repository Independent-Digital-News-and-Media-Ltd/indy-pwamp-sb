import { getCookie } from './cookie';
import {
  dispatchPaymentFormLoaded,
  dispatchPaymentDetailsSuccess,
  dispatchPaymentDetailsFailed,
} from './customEvents';

const addHandlers = (trackingData) => {
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
};

export const showPianoOffer = (offerId, termId, trackingDatas) => {
  addHandlers(trackingDatas);

  const tp = window.tp || [];
  tp.offer.show({
    offerId: offerId,
    termId: termId,
  });
};

export const startPianoCheckout = (trackingData) => {
  addHandlers(trackingData);

  // This cookie is created from onLoginRequired function in piano embed code
  const paramsCookie = decodeURIComponent(getCookie('__pianoParams'));
  const params = JSON.parse(paramsCookie);
  if (params !== undefined) {
    const tp = window.tp || [];
    tp.offer.startCheckout(params);
  } else {
    new Error('params not found');
  }
};
