import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

export default () => {
  // only load library if ayl element is present
  if (document.getElementById('ayl')) {
    jsLoader([
      `//fo-api.omnitagjs.com/fo-api/ot.js?Url=${encodeURIComponent(
        top.document.location.href,
      )}`,
    ]);
  }
};
