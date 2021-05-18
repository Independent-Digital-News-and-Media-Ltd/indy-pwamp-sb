/* global Sailthru */
import { loadJS } from './util';

export const initialiseSailthruSpider = async () => {
  if (!window.JSGlobals.sailthru) return;
  const { customerId } = window.JSGlobals.sailthru;

  await loadJS(['https://ak.sail-horizon.com/spm/spm.v1.min.js']);

  Sailthru.init({ customerId });
};

export default initialiseSailthruSpider;
