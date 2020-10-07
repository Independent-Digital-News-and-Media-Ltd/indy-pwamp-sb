/*globals JSGlobals */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

const { placement, campaign } = JSGlobals.adYouLike;

export default () => {
  // only load library if ayl element is present
  if (document.getElementById('thirdparty_section')) {
    jsLoader([
      `//fo-api.omnitagjs.com/fo-api/ot.js?Placement=${placement}&Campaign=${campaign}`,
    ]);
  }
};
