/* global _taboola */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

import { triggerOnScrolledIntoView } from './util';

const loadModule = (url) => {
  window._taboola = window._taboola || [];
  _taboola.push({
    article: 'auto',
    url: url,
  });

  const footerPrompt = document.getElementById('stickyFooterContainer');
  _taboola.push({
    listenTo: 'visible',
    handler: function (e) {
      if (
        e.detail.placement.indexOf('Below Article Thumbnails | Card 19') > -1
      ) {
        footerPrompt.style.display = 'none';
      }
    },
  });

  _taboola.push({
    mode: 'thumbnails-d1',
    container: 'taboola-below-article-1',
    placement: 'Below Article Thumbnails',
    target_type: 'mix',
  });

  _taboola.push({
    mode: 'alternating-thumbnails-d1',
    container: 'taboola-carousel-thumbnails',
    placement: 'Carousel Thumbnails',
    target_type: 'mix',
  });

  _taboola.push({
    mode: 'organic-thumbnails-d',
    container: 'taboola-below-article-2',
    placement: 'taboola-below-article-thumbnails-2nd',
    target_type: 'mix',
  });

  _taboola.push({
    mode: 'thumbnails-k1',
    container: 'taboola-right-rail',
    placement: 'Right Rail Thumbnails',
    target_type: 'mix',
  });

  _taboola.push({ flush: true });
};

const initialiseTaboola = () => {
  const { publisherId, articleUrl } = window.JSGlobals.taboola;
  if (publisherId && articleUrl) {
    jsLoader([`//cdn.taboola.com/libtrc/${publisherId}/loader.js`]);
    loadModule(articleUrl);
  }
};

export default () => {
  if (!window.JSGlobals.taboola) {
    return;
  }

  const taboolaElems = [
    ...document.querySelectorAll(
      '#taboola-right-rail,#taboola-below-article-1,#taboola-below-article-2,#taboola-carousel-thumbnails',
    ),
  ];

  if (!taboolaElems.length) {
    return;
  }

  if (document.location.search.includes('lazy-taboola')) {
    triggerOnScrolledIntoView(taboolaElems, initialiseTaboola, {
      tolerance: 200,
    });
  } else {
    initialiseTaboola();
  }
};
