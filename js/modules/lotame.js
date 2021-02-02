import { loadJS } from './util';

/* globals JSGlobals */
const OZONE_VENDOR = 524;
const LOTAME_TIMEOUT = 1000;

const checkOzoneConsents = (consentPassed) =>
  new Promise((resolve) => {
    if (!consentPassed) {
      resolve(false);
      return;
    }

    const apiCallback = (tcData, success) => {
      if (!success) {
        resolve(false);
        return;
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
        resolve(true);
        return;
      }

      resolve(false);
    };

    if (window.__tcfapi) {
      window.__tcfapi('getTCData', 2, apiCallback, [OZONE_VENDOR]);
    } else {
      resolve(false);
    }
  });

const lotameInit = async (bidCallback) => {
  const { id } = JSGlobals.lotame;
  const namespace = (window[`lotame_${id}`] = {});
  namespace.config = {
    clientId: id,
    onProfileReady: bidCallback,
    audienceLocalStorage: true,
  };
  namespace.data = {};
  namespace.cmd = [];

  await loadJS([`https://tags.crwdcntrl.net/lt/c/${id}/lt.min.js`]);
};

export default async (consent) => {
  await Promise.race([
    async () => {
      const ozoneConsents = await checkOzoneConsents(consent);

      if (ozoneConsents) {
        return await lotameInit();
      }
      console.warn('Consents not passed for Lotame');
    },
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, LOTAME_TIMEOUT);
      }),
  ]);
};
