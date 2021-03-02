import {
  dispatchArticleComplete,
  dispatchGalleryView,
  dispatchAutoGalleryView,
  dispatchArticleShare,
  dispatchSearch,
  dispatchMegaMenuLinkClick,
  dispatchMainNavLinkClick,
  dispatchMostPopularLinkClick,
  dispatchPopularVideosLinkClick,
  dispatchSponsoredFeaturesLinkClick,
  dispatchIndy100TrendingLinkClick,
  dispatchTaboolaFeedLinkClick,
  dispatchRelatedArticlesLinkClick,
  dispatchWatchMoreArticlesLinkClick,
  dispatchIpTabClick,
  dispatchDonationArticleBottom,
  dispatchCompletePurchase,
} from './customEvents';

import { EVENT_PIANO_READY } from '../constants/events';

const addPassiveEventListener = (target, type, listener, options, useCapture) =>
  target.addEventListener(
    type,
    listener,
    { passive: true, ...options },
    useCapture,
  );

const eventArticleComplete = () => {
  const main = document.getElementById('main');
  if (main) {
    // fire event once only
    let ticking = false;
    const reachArticleBottom = () =>
      window.scrollY + window.innerHeight >=
      main.clientHeight +
        main.getBoundingClientRect().top +
        document.documentElement.scrollTop;
    const listener = () => {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (reachArticleBottom()) {
            dispatchArticleComplete();
            // remove event once reaching the target.
            window.removeEventListener('scroll', listener);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    addPassiveEventListener(window, 'scroll', listener);
  }
};

const eventGalleryView = () => {
  [...document.querySelectorAll('.gallery-btn')].forEach((el) => {
    el.addEventListener('click', dispatchGalleryView);
  });
};

const eventAutoGalleryView = () => {
  [...document.querySelectorAll('.inline-gallery-btn')].forEach((el) => {
    el.addEventListener('click', dispatchAutoGalleryView);
  });
};

const eventAutoRenewalOff = () => {
  document.addEventListener(EVENT_PIANO_READY, () => {
    window.tp = window.tp || [];
    window.tp.push([
      'addHandler',
      'customEvent',
      (event) => {
        if (event.eventName === 'auto-renewal') {
          // @todo
        }
      },
    ]);
  });
};

const eventOpenLogin = () => {
  document.addEventListener(EVENT_PIANO_READY, () => {
    window.tp = window.tp || [];
    window.tp.push([
      'addHandler',
      'customEvent',
      (event) => {
        if (event.eventName === 'openLogin') {
          document
            .querySelector('header button[on="tap:sidebar.open"]')
            .click();
        }
      },
    ]);
  });
};

const eventContributeClick = () => {
  document.addEventListener(EVENT_PIANO_READY, () => {
    window.tp = window.tp || [];
    window.tp.push([
      'addHandler',
      'customEvent',
      (event) => {
        if (event.eventName === 'donation-prompt') {
          dispatchDonationArticleBottom();
          window.location.href = event.params?.url;
        }
      },
    ]);
  });
};

const eventCompletePurchase = () => {
  document.addEventListener(EVENT_PIANO_READY, () => {
    window.tp = window.tp || [];
    window.tp.push([
      'addHandler',
      'customEvent',
      (event) => {
        if (event.eventName === 'complete-purchase') {
          dispatchCompletePurchase();
        }
      },
    ]);
  });
};

const eventArticleShare = () => {
  const buttons = document.querySelectorAll('.social-share amp-social-share');
  buttons?.forEach((btn) => {
    addPassiveEventListener(btn, 'click', (event) => {
      const type = event.currentTarget.getAttribute('type');
      if (type !== 'bookmark') {
        dispatchArticleShare({
          social_media_platform: type,
        });
      }
    });
  });
};

const eventSearch = () => {
  // @see https://developers.google.com/custom-search/docs/element#results-rendered
  window.__gcse || (window.__gcse = {});
  window.__gcse.searchCallbacks = {
    web: {
      rendered: (name, q, promos, results) => {
        const info = results[0]
          ?.closest('.gsc-results-wrapper-visible')
          ?.querySelector('.gsc-result-info')?.innerText;

        // get number of result from the info string
        // example: "About 91,200 results (0.26 seconds)"
        const matches = info?.match(/([\d,]+).*\(.+\)/);
        dispatchSearch({
          search_term: q,
          // remove comma from captured string
          // add whole info string if matches[1] not found for debug.
          search_results_count: matches ? matches[1].replace(',', '') : info,
        });
      },
    },
  };
};

const eventMegaMenulinkClick = () => {
  const links = document.querySelectorAll('#full-menu .link');
  links?.forEach((link) => {
    addPassiveEventListener(link, 'click', (event) => {
      const text = event.target.innerText;
      const category = event.target
        .closest('.section-list')
        ?.previousSibling?.querySelector('.link')?.innerText;
      dispatchMegaMenuLinkClick({
        mega_menu_link_text: text,
        mega_menu_link_category: category,
      });
    });
  });
};

const eventMainNavLinkClick = () => {
  const links = document.querySelectorAll('.menu-navbar-item a');
  links?.forEach((link) => {
    addPassiveEventListener(link, 'click', (event) => {
      const text = event.target.innerText;
      const category =
        event.target.closest('.menu-navbar-item > ul')?.previousSibling
          ?.innerText || text;
      dispatchMainNavLinkClick({
        main_nav_link_text: text,
        main_nav_link_category: category,
      });
    });
  });
};

const eventMostPopularLinkClick = () => {
  const widgets = document.querySelectorAll('.most-popular');
  widgets?.forEach((widget) => {
    addPassiveEventListener(widget, 'click', (event) => {
      event.stopPropagation();
      const item = event.target.closest('[role="listitem"]');
      if (item) {
        const text = item?.children[1]?.innerText;
        const articleId = item.dataset?.articleId;
        const position = item.dataset?.position;
        dispatchMostPopularLinkClick({
          most_popular_link_text: text,
          most_popular_link_position: position,
          most_popular_link_article_id: articleId,
        });
      }
    });
  });
};

const eventPopularVideosLinkClick = () => {
  const widgets = document.querySelectorAll('.popular-videos');
  widgets?.forEach((widget) => {
    addPassiveEventListener(widget, 'click', (event) => {
      event.stopPropagation();
      const item = event.target.closest('[role="listitem"]');
      if (item) {
        const text = item?.children[1]?.innerText;
        const articleId = item.dataset?.articleId;
        const position = item.dataset?.position;
        dispatchPopularVideosLinkClick({
          popular_videos_link_text: text,
          popular_videos_link_position: position,
          popular_videos_link_article_id: articleId,
        });
      }
    });
  });
};

const eventSponsoredFeaturesLinkClick = () => {
  const widgets = document.querySelectorAll('.sponsored-features');
  widgets.forEach((widget) => {
    addPassiveEventListener(widget, 'click', (event) => {
      event.stopPropagation();
      const item = event.target.closest('[role="listitem"]');
      if (item) {
        const text = item?.children[1]?.innerText;
        const articleId = item.dataset?.articleId;
        const position = item.dataset?.position;
        dispatchSponsoredFeaturesLinkClick({
          sponsored_features_link_text: text,
          sponsored_features_link_position: position,
          sponsored_features_link_article_id: articleId,
        });
      }
    });
  });
};

const eventIndy100TrendingLinkClick = () => {
  const widgets = document.querySelectorAll('.indy100-trending');
  widgets.forEach((widget) => {
    addPassiveEventListener(widget, 'click', (event) => {
      event.stopPropagation();
      const item = event.target.closest('[role="listitem"]');
      if (item) {
        const text = item?.children[1]?.innerText;
        const articleId = item?.dataset?.articleId;
        const position = item?.dataset?.position;
        dispatchIndy100TrendingLinkClick({
          indy100_trending_link_text: text,
          indy100_trending_link_position: position,
          indy100_trending_link_article_id: articleId,
        });
      }
    });
  });
};

const eventReadMoreLinkClick = () => {};

const eventTaboolaFeedLinkClick = () => {
  const widgets = document.querySelectorAll('.taboola-below-article');
  widgets.forEach((widget) => {
    addPassiveEventListener(widget, 'click', (event) => {
      event.stopPropagation();
      const text = event.target.closest('[data-item-title]')?.dataset
        ?.itemTitle;
      const position = event.target.closest('.tbl-feed-card')?.dataset
        ?.cardIndex;
      dispatchTaboolaFeedLinkClick({
        taboola_feed_link_text: text,
        taboola_feed_link_position: position,
      });
    });
  });
};

const eventRelatedArticlesLinkClick = () => {
  const widgets = document.querySelectorAll('aside.related');

  widgets.forEach((widget) => {
    // check if watch more title & then fire different event
    const isWatchMore = widget.dataset.isWatchMore === 'true';
    const dispatchEvent = isWatchMore
      ? dispatchWatchMoreArticlesLinkClick
      : dispatchRelatedArticlesLinkClick;

    addPassiveEventListener(widget, 'click', (event) => {
      event.stopPropagation();
      const item = event.target.closest('.related-item');
      if (item) {
        const text = item?.children[1]?.innerText;
        const position = item?.dataset?.position;
        dispatchEvent({
          related_articles_link_text: text,
          related_articles_link_position: position,
        });
      }
    });
  });
};

const eventIPTabClick = () => {
  const tabs = document.querySelectorAll('#premium-menu [data-tab]');
  tabs.forEach((tab) => {
    addPassiveEventListener(tab, 'click', () => {
      const url = document.location.href;
      const name = tab.dataset.tab;
      dispatchIpTabClick({
        tab_url: url,
        tab_name: name,
      });
    });
  });
};

export default () => {
  eventArticleComplete();
  eventGalleryView();
  eventAutoGalleryView();
  eventAutoRenewalOff();
  eventOpenLogin();
  eventArticleShare();
  eventSearch();
  eventMegaMenulinkClick();
  eventMainNavLinkClick();
  eventMostPopularLinkClick();
  eventPopularVideosLinkClick();
  eventSponsoredFeaturesLinkClick();
  eventIndy100TrendingLinkClick();
  eventReadMoreLinkClick();
  eventTaboolaFeedLinkClick();
  eventRelatedArticlesLinkClick();
  eventIPTabClick();
  eventContributeClick();
  eventCompletePurchase();
};
