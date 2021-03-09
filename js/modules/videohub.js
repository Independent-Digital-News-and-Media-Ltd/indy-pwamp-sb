/* globals JSGlobals, videohubSetup */

const videohubSetupWithPermutive = (permutiveEnabled) => {
  const args = {
    videoAdUnitPath: JSGlobals.videohubAdUnitPath,
    permutiveEnabledAndConsentGiven: permutiveEnabled,
  };
  videohubSetup(args);
};

export default (permutiveConsent) => {
  const permutiveEnabled = permutiveConsent && window.JSGlobals.permutive;

  if (typeof videohubSetup === 'function') {
    //videohub already loaded, therefore event has already fired; too late to set up a listener
    videohubSetupWithPermutive(permutiveEnabled);
  } else {
    //videohub not loaded yet, set up a listener for the event that will be dispatched once it loads
    document.addEventListener('videohubSetupReady', () => {
      videohubSetupWithPermutive(permutiveEnabled);
    });
  }
};
