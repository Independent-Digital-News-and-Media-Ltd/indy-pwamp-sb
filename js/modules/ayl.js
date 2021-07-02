import { triggerOnScrolledIntoView } from './util';
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

const initialiseAyl = () => {
  return jsLoader([
    `//fo-api.omnitagjs.com/fo-api/ot.js?Url=${encodeURIComponent(
      top.document.location.href,
    )}`,
  ]);
};

export default async () => {
  const wrapper = document.getElementById('ayl');

  if (!wrapper) return;

  return await triggerOnScrolledIntoView([wrapper], initialiseAyl, {
    tolerance: 200,
  });
};
