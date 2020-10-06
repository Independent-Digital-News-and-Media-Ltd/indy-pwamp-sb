/* globals JSGlobals */

export const checkConsent = (callback) => {
  if (!JSGlobals.cmp.enabled) {
    callback(true);
    return;
  }

  const apiCallback = (tcData, success) => {
    if (!success) {
      callback(false);
      return;
    }

    if (!['useractioncomplete', 'tcloaded'].includes(tcData.eventStatus)) {
      return;
    }

    if (!tcData.gdprApplies) {
      callback(true);
      return;
    }

    if (tcData.publisher?.consents?.['1']) {
      callback(true);
      return;
    }

    callback(false);
  };

  window.__tcfapi('addEventListener', 2, apiCallback);
};
