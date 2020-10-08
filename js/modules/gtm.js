/* globals JSGlobals */
import { initGTMScript } from '@brightsites/flow-core/lib/utils/gtm';

export default () => {
  initGTMScript(JSGlobals.gtm.containerId);
};
