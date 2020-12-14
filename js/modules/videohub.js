/* globals JSGlobals, permutive, videohubSetup */
import { initPermutiveReadyWithTimeout } from './permutive';

let permutiveEnabled;

const videohubSetupWithPermutive = () => {
  const args = {
    videoAdUnitPath: JSGlobals.videohubAdUnitPath,
  };
  if (permutiveEnabled) {
    permutive.readyWithTimeout(
      videohubSetup.bind(this, args),
      'realtime',
      2500,
    );
  } else {
    videohubSetup(args);
  }
};

export default (permutiveConsent) => {
  permutiveEnabled = permutiveConsent && window.JSGlobals.permutive;
  permutiveEnabled && initPermutiveReadyWithTimeout();

  if (typeof videohubSetup === 'function') {
    //videohub already loaded, therefore event has already fired; too late to set up a listener
    videohubSetupWithPermutive();
  } else {
    //videohub not loaded yet, set up a listener for the event that will be dispatched once it loads
    document.addEventListener('videohubSetupReady', () => {
      videohubSetupWithPermutive();
    });
  }
};
