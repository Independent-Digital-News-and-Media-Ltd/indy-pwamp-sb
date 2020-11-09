/* global Sailthru */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

export const initialiseSailthruSpider = () => {
  if (!window.JSGlobals.sailthru) return;
  const { customerId } = window.JSGlobals.sailthru;

  jsLoader(['https://ak.sail-horizon.com/spm/spm.v1.min.js'], () => {
    Sailthru.init({ customerId });
  });
};

export default initialiseSailthruSpider;
