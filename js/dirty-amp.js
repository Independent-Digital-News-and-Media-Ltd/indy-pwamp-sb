/* globals JSGlobals */
import * as Throttle from 'promise-parallel-throttle';

import { loadJS } from './modules/util';
import { group, groupEnd } from './modules/log';
import * as timer from './modules/timer';
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
import { initPermutive } from './modules/permutive';
import JWPlayer from './modules/jwplayer';
import Bombora from './modules/bombora';
import Videohub from './modules/videohub';
import ayl from './modules/ayl';
import eventBindings from './modules/eventBindings';
import form from './modules/form';
import indexing from './modules/indexing';
import persistentPlayer from './modules/persistentPlayer';
import prebid from './modules/prebid';
import sailthruSpider from './modules/sailthruSpider';
import showReturnToVideoCTA from './modules/showReturnToVideoCTA';
import hardRefresh from './modules/hardRefresh';
import hideShowPassword from './modules/hideShowPassword';
import register from './modules/register';
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
import moat from './modules/moat';
import { getCookie } from './modules/cookie';
import editionToggle from './modules/editionToggle';
import topMenu from './top-menu';
import { populatePermutiveId } from './populatePermutiveId';
import navbarScroll from './navbarScroll';
import videoArticleLayout from './modules/videoArticleLayout';
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
//import anchorSmoothScroll from './modules/anchorSmoothScroll';

timer.init();
timer.start('first ad load');

window.JSGlobals = window.JSGlobals || {
  mode: 'development',
};

const isUKDomain = JSGlobals.domain === 'independent.co.uk';
const refresh = JSGlobals.isSection;
const prebidEnabled =
  window.JSGlobals.mode === 'development'
    ? true
    : getCookie('subscriber_origin') === 'uk';
const inCMSView = location.search.includes('live-browse');

const gptInit = async (consent) => {
  await gpt({
    refresh,
    slotRenderedCallback: slotCallBack.onRendered,
    slotLoadedCallback: slotCallBack.onLoaded,
    consent,
    prebidEnabled,
    firstAdLoaded: () => {
      timer.end('first ad load');
    },
  });
};

let consent;

const initialisers = [
  {
    digitalData, // run it before GTM
    dotmetrics,
    indexing: !inCMSView && indexing,
    gtm: !inCMSView && gtm,
    gptTag: async () => {
      await loadJS(['https://securepubads.g.doubleclick.net/tag/js/gpt.js']);
    },
    moat,
    consent: {
      method: async () => {
        consent = await checkConsent();
      },
      dependents: {
        permutive: async () => {
          initPermutive(consent);
        },
        indexExchange,
        prebid: () => {
          jsLoader(['/js/third-party/prebid.js'], async () => {
            if (prebidEnabled) {
              await prebid();
            }
          });
        },
        experian: async () => {
          await loadJS([
            `https://experianmatch.info/log.js?fpid=pubcommonid=${getCookie(
              '_pubcid',
            )},permutive=${getCookie('permutive-id')}&publisherid=MP001`,
          ]);
        },
      },
    },
  },
  {
    gpt:
      !inCMSView &&
      (async () => {
        await gptInit(consent);
      }),
  },
  {
    JWPlayer: () => {
      JWPlayer(consent);
    },
    Videohub: () => {
      Videohub(consent);
    },
    skinSpacer,
    pushNotifications,
    initComments: JSGlobals.userComments && JSGlobals.article && initComments,
    initBookmark: isUKDomain && JSGlobals.article && initBookmark,
    initCompetition:
      JSGlobals.userLogin && JSGlobals.article && initCompetition,
    newsletterRedirect,
    form,
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
    register,
    login,
    sticky,
    topMenu,
    navbarScroll,
    scoreboard,
    ayl,
    stickyFooter,
    editionToggle,
    locale: isUKDomain && locale,
    populatePermutiveId,
    videoArticleLayout,
    Bombora,
    // anchorSmoothScroll,
  },
  {
    googleSearch: async () => {
      // @TODO set up search for indy.ru
      if (JSGlobals.cseId) {
        await initGoogleSearch(JSGlobals.cseId);
      }
    },
    userStatus: JSGlobals.userLogin && userStatus,
    taboola,
  },
];

const initPromises = (inits) =>
  Object.keys(inits).map((key) => async () => {
    const initFunc = inits[key];

    if (!initFunc) {
      return;
    }

    timer.start(key);

    try {
      if (initFunc.method) {
        await initFunc.method();
        timer.end(key);
        if (initFunc.dependents) {
          const groupName = `${key} deps`;
          group(groupName);
          await Throttle.all(initPromises(initFunc.dependents));
          groupEnd(groupName);
        }
      } else {
        await initFunc();
        timer.end(key);
      }
    } catch (e) {
      console.warn(`Error caught in ${key}()`);
      console.error(e);
    }
  });

const initialiseModules = async () => {
  for (let i = 0; i < initialisers.length; i++) {
    const groupName = `group ${i + 1}`;
    group(groupName);
    await Throttle.all(initPromises(initialisers[i]));
    groupEnd(groupName);
  }
};

initialiseModules();
