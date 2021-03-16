import { loadJS } from './util';

export default async () => {
  // only load library if ayl element is present
  if (document.getElementById('ayl')) {
    await loadJS([
      `//fo-api.omnitagjs.com/fo-api/ot.js?Url=${encodeURIComponent(
        top.document.location.href,
      )}`,
    ]);
  }
};
