import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

export const delayForMoatTargeting = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('Done');
    }, 500);
  });

export default () => {
  window['moatYieldReady'] = function () {
    window.moatTargetingSet = true;
    window.moatPrebidApi.setMoatTargetingForAllSlots();
  };

  jsLoader(['https://z.moatads.com/esimediaheader313469025490/moatheader.js']);
};
