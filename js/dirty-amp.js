/* globals JSGlobals */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import delayMenuHoverState from './modules/menu';
import articleNextPrev from './modules/articleNextPrev';
import gtm from './modules/gtm';
import gpt from './modules/indy-gpt';
import locale from './modules/locale';
import initGoogleSearch from './modules/googleSearch';
import userStatus from './modules/userStatus';
import initComments from './modules/comments';
import initBookmark from './modules/bookmark';
import initCompetition from './modules/competition';
import newsletterRedirect from './modules/newsletter';
import zendesk from './modules/zendesk';
import apester from './modules/apester';
import permutive from './modules/permutive';
import JWPlayer from './modules/jwplayer';
import ayl from './modules/ayl';
import eventBindings from './modules/eventBindings';
import indexing from './modules/indexing';
import persistentPlayer from './modules/persistentPlayer';
import prebid from './modules/prebid';
import lotame from './modules/lotame';
import sailthruSpider from './modules/sailthruSpider';
import showReturnToVideoCTA from './modules/showReturnToVideoCTA';
import hardRefresh from './modules/hardRefresh';
import hideShowPassword from './modules/hideShowPassword';
import login from './modules/login';
import * as slotCallBack from './modules/slotCallBack';
import stickyFooter from './modules/stickyFooter';
import scoreboard from './modules/scoreboard';
import { checkConsent } from './modules/cmp';
import sticky from './modules/sticky';
import taboola from './modules/taboola';
import skinSpacer from './modules/skinSpacer';
import digitalData from './modules/digitalData';
import indexExchange from './modules/indexExchange';
import pushNotifications from './modules/push-notifications';
import dotmetrics from './modules/dotmetrics';

// Prebid
import './third-party/prebid.js';

window.JSGlobals = window.JSGlobals || {
  mode: 'development',
};

const isUKDomain = JSGlobals.domain === 'independent.co.uk';
const refresh = JSGlobals.isSection;

const gptInit = (consent) => {
  gpt({
    refresh,
    slotRenderedCallback: slotCallBack.onRendered,
    slotLoadedCallback: slotCallBack.onLoaded,
    consent,
    prebidEnabled: isUKDomain,
  });
};

const initialisers = {
  digitalData, // run it before GTM
  scoreboard,
  ayl,
  dotmetrics,
  stickyFooter,
  locale: isUKDomain && locale,
  userStatus: JSGlobals.userLogin && userStatus,
  initComments: JSGlobals.userComments && JSGlobals.article && initComments,
  initBookmark: isUKDomain && JSGlobals.article && initBookmark,
  initCompetition: JSGlobals.userLogin && JSGlobals.article && initCompetition,
  newsletterRedirect,
  zendesk,
  apester,
  sailthruSpider,
  articleNextPrev,
  delayMenuHoverState,
  eventBindings,
  persistentPlayer,
  showReturnToVideoCTA,
  hardRefresh: refresh && hardRefresh,
  hideShowPassword,
  login,
  sticky,
  gtm: () => {
    // @TODO set up search for indy.ru
    JSGlobals.cseId && initGoogleSearch(JSGlobals.cseId);
    if (!/live-browse/.test(location.search)) {
      gtm();
      indexing();
      jsLoader(['https://securepubads.g.doubleclick.net/tag/js/gpt.js'], () => {
        checkConsent((consent) => {
          permutive(consent);
          indexExchange();
          isUKDomain
            ? lotame(consent, () => prebid(() => gptInit(consent)))
            : gptInit(consent);
          JWPlayer(consent);
          taboola();
        });
      });
    }
  },
  skinSpacer,
  pushNotifications,
};

Object.keys(initialisers).forEach((key) => {
  if (initialisers[key]) {
    // console.time(key);

    try {
      initialisers[key]();
    } catch (e) {
      console.warn(`Error caught in ${key}()`);
      console.error(e);
    }

    // console.timeEnd(key);
  }
});

const toggleNewsletterFormVisibility = function () {
  if (document.readyState === 'complete') {
    document.querySelector('.newsletter-component')?.classList.toggle('hide');
  } else {
    setTimeout(function () {
      toggleNewsletterFormVisibility();
    }, 100);
  }
};

toggleNewsletterFormVisibility();
