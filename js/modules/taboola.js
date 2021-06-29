/* global _taboola */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

import { triggerOnScrolledIntoView } from './util';

const taboolaUnits = [
  {
    mode: 'thumbnails-d1',
    container: 'taboola-below-article-1',
    placement: 'Below Article Thumbnails',
    target_type: 'mix',
  },
  {
    mode: 'alternating-thumbnails-d1',
    container: 'taboola-carousel-thumbnails',
    placement: 'Carousel Thumbnails',
    target_type: 'mix',
  },
  {
    mode: 'thumbnails-k1',
    container: 'taboola-right-rail',
    placement: 'Right Rail Thumbnails',
    target_type: 'mix',
  },
  {
    mode: 'organic-thumbs-feed-01',
    container: 'taboola-below-indy-best-feed',
    placement: 'Below Indy Best Feed',
    target_type: 'mix',
  },
  {
    mode: 'rbox-tracking',
    container: 'taboola-newsroom',
    placement: 'Newsroom',
  },
];
const gigyaUserStatusToTaboolaUserType = (status) => {
  return (
    {
      premium: 'subscriber',
      registered: 'registered',
      anonymous: 'guest',
    }[status] || 'other'
  );
};
const addPaywallTracking = (article) => {
  const { gigya_user_status: userStatus, gigya_uid: userId } =
    window.digitalData;

  window._taboola.push({
    unified_id: userId,
    user_type: gigyaUserStatusToTaboolaUserType(userStatus),
    paywall: article.premium && userStatus !== 'premium',
  });
};

const loadModule = (url) => {
  window._taboola = window._taboola || [];
  _taboola.push({
    article: 'auto',
    url: url,
  });

  const footerPrompt = document.getElementById('stickyFooterContainer');
  _taboola.push({
    listenTo: 'visible',
    handler: (e) => {
      if (e.detail.placement.includes('Below Article Thumbnails | Card 19')) {
        footerPrompt.style.display = 'none';
      }
    },
  });

  taboolaUnits.forEach((unit) => {
    const container = document.getElementById(unit.container);
    if (container) {
      const display = window
        .getComputedStyle(container)
        .getPropertyValue('display');
      if (display !== 'none') {
        _taboola.push(unit);
      }
    }
  });

  const { article } = window.JSGlobals;
  if (article) {
    addPaywallTracking(article);
    if (article.premium) {
      _taboola.push({ premium: true });
    }
  }

  _taboola.push({ flush: true });
};

const initialiseTaboola = () => {
  const { publisherId, publisherIdIndyBest, articleUrl } =
    window.JSGlobals.taboola;

  if ((publisherId || publisherIdIndyBest) && articleUrl) {
    const id = articleUrl.includes('indybest')
      ? publisherIdIndyBest
      : publisherId;
    jsLoader([`//cdn.taboola.com/libtrc/${id}/loader.js`]);
    loadModule(articleUrl);
  }

  window?.performance?.mark?.('tbl_ic');
};

const subscriptionCauseKey = 'subscription-cause';

function saveSubscriptionCause() {
  const { articleUrl } = window.JSGlobals;
  if (articleUrl) {
    localStorage.setItem(subscriptionCauseKey, articleUrl);
  }
}

export function trackSubscriptionCause() {
  const articleUrl = localStorage.getItem(subscriptionCauseKey);
  if (articleUrl) {
    window._tfa = window._tfa = [];
    window._tfa.push({
      notify: 'subscription',
      name: 'subscription-completed',
      sourceurl: articleUrl,
    });
    jsLoader(['//cdn.taboola.com/libtrc/unip/1018671/tfa.js']);
  }
}

export default () => {
  if (!window.JSGlobals.taboola) {
    return;
  }
  const taboolaElems = taboolaUnits.map((unit) =>
    document.getElementById(unit.container),
  );

  if (!taboolaElems.length) {
    return;
  }

  // we're saving the latest article to send it when subscription happens
  saveSubscriptionCause();

  if (document.location.search.includes('lazy-taboola')) {
    triggerOnScrolledIntoView(taboolaElems, initialiseTaboola, {
      tolerance: 200,
    });
  } else {
    initialiseTaboola();
  }
};
