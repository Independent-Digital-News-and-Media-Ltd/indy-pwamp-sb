/* globals JSGlobals */
const OZONE_VENDOR = 524;
const LOTAME_TIMEOUT = 1000;

const checkOzoneConsents = (consentPassed, callback) => {
  if (!consentPassed) {
    return callback(false);
  }

  const apiCallback = (tcData, success) => {
    if (!success) {
      return callback(false);
    }

    const publisherConsents = tcData.publisher?.consents;
    const purposeConsents = tcData.purpose?.consents;
    const vendorConsents = tcData.vendor?.consents;
    const standardPurposeConsents = purposeConsents
      ? Object.values(purposeConsents).slice(0, 5).toString()
      : null;

    if (
      publisherConsents &&
      standardPurposeConsents === [true, true, true, true, true].toString() &&
      vendorConsents[OZONE_VENDOR]
    ) {
      return callback(true);
    }

    callback(false);
  };

  if (window.__tcfapi) {
    return window.__tcfapi('getTCData', 2, apiCallback, [OZONE_VENDOR]);
  }

  callback(false);
};

const lotameInit = (bidCallback) => {
  const addScript = (url) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    try {
      document.body.appendChild(script);
    } catch (e) {
      console.error(`Couldn't append lotame script to page. Error: ${e}`);
    }
  };

  const { id } = JSGlobals.lotame;
  const namespace = (window[`lotame_${id}`] = {});
  namespace.config = {
    clientId: id,
    onProfileReady: bidCallback,
    audienceLocalStorage: true,
  };
  namespace.data = {};
  namespace.cmd = [];

  addScript(`https://tags.crwdcntrl.net/lt/c/${id}/lt.min.js`);
};

export default (consent, bidCallback) => {
  setTimeout(bidCallback, LOTAME_TIMEOUT);

  checkOzoneConsents(consent, (ozoneConsents) => {
    if (!ozoneConsents) {
      console.warn('Consents not passed for Lotame');
      return bidCallback();
    }
    lotameInit(bidCallback);
  });
};
