/* eslint-disable no-console */
/* globals jwplayer, JSGlobals, permutive, moatjw, wtAdTracer */

import { getCookie } from './cookie';
import { initPermutiveReadyWithTimeout } from './permutive';

const now = new Date();
let index,
  videoObject,
  current_mediaid,
  title,
  description,
  duration,
  updated_at,
  pub_date,
  firstQuartile,
  adTag,
  playSessionId,
  adFirstQuartile,
  permutiveEnabled,
  adtitle,
  adclickthroughurl,
  adsystem;
let quartilesElapsed = [];
let isFirstPlay = true;
let adQuartilesElapsed = [];
let adtime = 0;
let adTimeFlag = true;
let adPos = 0;
let tags = [];

const enrichTag = (adTag, mediaid, playerType) => {
  let customParams = '';
  customParams += 'videoID%3D' + mediaid;
  customParams += '%26articleId%3D' + JSGlobals.pageId?.replace(/\D/g, '');
  customParams +=
    '%26gs_channels%3D' +
    (JSGlobals.gs_channels && JSGlobals.gs_channels.join());
  customParams += '%26playerType%3D' + playerType;
  customParams +=
    '%26topictags%3D' + (JSGlobals.topictags && JSGlobals.topictags.join());

  //permutive inclusion
  if (permutiveEnabled) {
    const permutiveSegments = encodeURIComponent(
      'permutive=' +
        encodeURIComponent(
          JSON.parse(localStorage._pdfps || '[]')
            .slice(0, 250)
            .join(','),
        ),
    );
    customParams += '%26' + permutiveSegments;
  }

  //placeholder for adPos
  customParams += '%26adpos%3D0';

  const tagUrl = new URL(adTag);
  const urlParams = new URLSearchParams(tagUrl.search);
  if (urlParams.has('cust_params')) {
    if (urlParams.get('cust_params') !== '') {
      customParams = '%26' + customParams;
      adTag = adTag.replace(/(cust_params[^&]+)/, '$1' + customParams);
    } else {
      adTag = adTag.replace(/(cust_params[^&]+)/, '$1' + customParams);
    }
  } else {
    adTag = adTag + '&cust_params=' + customParams;
  }
  adTag =
    adTag +
    '&gdpr=' +
    getCookie('gdpr', 'none') +
    '&gdpr_consent=' +
    getCookie('euconsent', 'none') +
    '&addtl_consent=' +
    getCookie('addtl_consent', 'none');
  const replacementAdTagUnit = JSGlobals.videoAdUnitPath;
  if (replacementAdTagUnit) {
    adTag = adTag.replace(/(iu=).*?(&)/, '$1' + replacementAdTagUnit + '$2');
  }
  return adTag;
};

const addToTagAndIncrementAdPos = (adTag) => {
  adTag = adTag.replace(/(adpos%3D).*?(&)/, '$1' + adPos + '$2');
  adPos++;
  return adTag;
};

// Helper function to evaluate if to track the time progress event to Permutive
const timeProgressMatch = (progress, quartile) => {
  if (quartilesElapsed.includes(quartile)) return false;
  else {
    if (Math.floor(progress) === quartile) {
      quartilesElapsed.push(quartile);
      return true;
    } else {
      return false;
    }
  }
};

// Helper function to evaluate if to track the time progress event to Permutive
const adTimeProgressMatch = (progress, quartile) => {
  if (adQuartilesElapsed.includes(quartile)) return false;
  else {
    if (Math.floor(progress) === quartile) {
      adQuartilesElapsed.push(quartile);
      return true;
    } else {
      return false;
    }
  }
};

//Helper function to generate a UUID to assign to the user
const generatePermutiveUUID = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const permutiveEventTracking = (eventName, trackingPayload) => {
  if (permutiveEnabled) {
    console.log('permutiveEventTracking ' + eventName);
    window.permutive.track(eventName, trackingPayload);
  }
};

const addWatchingThat = () => {
  const wtScript = document.createElement('script');
  wtScript.src = 'https://cdn.watchingthat.net/wtat.plugin-jw.min.js';
  document.getElementsByTagName('head')[0].appendChild(wtScript);
};

const addMoat = () => {
  const mScript = document.createElement('script');
  mScript.src = 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js';
  document.getElementsByTagName('head')[0].appendChild(mScript);
};

const jwplayerSetup = ({ containerId, playerType, options }) => {
  const subscriber = getCookie('subscriber') === 'true';
  if (subscriber || JSGlobals.article?.premium) {
    options.skin = {
      name: 'independent-premium',
    };
  }
  jwplayer(containerId).setup(options);
  //manually push jwplayer to chartbeat, as it's no longer on the page
  window._cbv = window._cbv || [];
  window._cbv.push(jwplayer);

  jwplayer(containerId).on('ready', function () {
    try {
      wtAdTracer(
        {
          apiKey:
            'T2I0ZnJHZzdrSnxmNzNmNjg0NzVmYTUzZjk2MzU2ZTNjZGRjYWI0MTljNA==',
          manualAdReq: true,
        },
        containerId,
        true,
      );
      // eslint-disable-next-line no-empty
    } catch (e) {}
    playSessionId = permutiveEnabled && generatePermutiveUUID();
    current_mediaid = jwplayer(containerId).getConfig().playlistItem.mediaid;
    jwplayer(containerId).pause();
    if (jwplayer(containerId).getConfig().advertising.schedule[0].tag) {
      adTag = jwplayer(containerId).getConfig().advertising.schedule[0].tag;
      adTag = enrichTag(adTag, current_mediaid, playerType);
      jwplayer(containerId).getConfig().advertising.schedule[0].tag = adTag;
    } else {
      adTag = jwplayer.defaults.advertising.schedule[0].tag;
      adTag = enrichTag(adTag, current_mediaid, playerType);
      jwplayer.defaults.advertising.schedule[0].tag = adTag;
    }

    console.log('adTag:', adTag);

    permutiveEventTracking('VideoLoad', {
      video: {
        duration: duration,
        name: title,
        custom_fields: [],
        video_id: current_mediaid,
        description: description,
        tags: tags,
        created_at: updated_at,
        published_at: pub_date,
      },
      play_id: playSessionId,
      auto_start: false,
    });
  });

  jwplayer(containerId).on('playlistItem', function () {
    isFirstPlay = true; // This resets the counter for making an AdRequest when new content available
    //Resetting video objects for new tracking
    index = jwplayer(containerId).getPlaylistIndex();
    videoObject = jwplayer(containerId).getPlaylistItem(index);
    current_mediaid = videoObject.mediaid;
    title = videoObject.title;
    if (videoObject.tags !== '' && videoObject.tags !== undefined) {
      tags = videoObject.tags.split(',');
    }
    description = videoObject.description;
    duration = videoObject.duration;
    updated_at = videoObject.updated_at;
    pub_date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    pub_date.setUTCSeconds(videoObject.pubdate);
    firstQuartile = Math.floor(duration / 4);
    quartilesElapsed = [];
    adQuartilesElapsed = [];

    if (jwplayer(containerId).getConfig().advertising.schedule[0].tag) {
      adTag = addToTagAndIncrementAdPos(adTag);
      jwplayer(containerId).getConfig().advertising.schedule[0].tag = adTag;
    } else {
      adTag = addToTagAndIncrementAdPos(adTag);
      jwplayer.defaults.advertising.schedule[0].tag = adTag;
    }
  });

  jwplayer(containerId).on('beforePlay', function () {
    if (isFirstPlay) {
      jwplayer(containerId).trigger('wt:adReq', {
        adsRequest: { adTagUrl: adTag },
      });
      isFirstPlay = false;
    }
  });

  //** Data tracking ***************************************************

  jwplayer(containerId).on('play', function () {
    permutiveEventTracking('VideoPlay', {
      video: {
        duration: duration,
        name: title,
        custom_fields: [],
        video_id: current_mediaid,
        description: description,
        tags: tags,
        watch_count: 1,
        created_at: updated_at,
        published_at: pub_date,
      },
      play_id: playSessionId,
      auto_start: true,
    });
  });

  jwplayer(containerId).on('pause', function () {
    permutiveEventTracking('VideoEvent', {
      timestamp: now.getTime(),
      event: 'PressedPause',
      video: {
        duration: duration,
        name: title,
        custom_fields: [],
        video_id: current_mediaid,
        description: description,
        tags: tags,
        watch_count: 1,
        created_at: updated_at,
        published_at: pub_date,
      },
      play_id: playSessionId,
    });
  });

  jwplayer(containerId).on('seek', function (timeObject) {
    permutiveEventTracking('VideoProgress', {
      seeked: true,
      progress: timeObject.offset,
      video: {
        duration: duration,
        name: title,
        custom_fields: [],
        video_id: current_mediaid,
        description: description,
        tags: tags,
        watch_count: 1,
        created_at: updated_at,
        published_at: pub_date,
      },
      client: {
        url: window.location.href,
        type: 'web',
        domain: window.location.hostname,
        user_agent: navigator.userAgent,
      },
      play_id: playSessionId,
    });
  });

  jwplayer(containerId).on('time', function (timeObject) {
    if (
      timeProgressMatch(timeObject.position, firstQuartile) ||
      timeProgressMatch(timeObject.position, firstQuartile * 2) ||
      timeProgressMatch(timeObject.position, firstQuartile * 3) ||
      timeProgressMatch(timeObject.position, duration)
    ) {
      permutiveEventTracking('VideoProgress', {
        seeked: false,
        progress: timeObject.position,
        video: {
          duration: timeObject.duration,
          name: title,
          custom_fields: [],
          video_id: current_mediaid,
          description: description,
          tags: tags,
          watch_count: 1,
          created_at: updated_at,
          published_at: pub_date,
        },
        client: {
          url: window.location.href,
          type: 'web',
          domain: window.location.hostname,
          user_agent: navigator.userAgent,
        },
        play_id: playSessionId,
      });
    }
  });

  jwplayer(containerId).on('adImpression', function (adobject) {
    adtitle = adobject.adtitle;
    adclickthroughurl = adobject.clickThroughUrl;
    adsystem = adobject.adsystem;
    moatjw.add({
      partnerCode: 'esimediaimajwplayer261872615678',
      player: this,
      adImpressionEvent: adobject,
    });
  });

  jwplayer(containerId).on('adTime', function (adTimeObject) {
    if (adTimeFlag && adTimeObject.position > 0) {
      adtime = parseInt(adTimeObject.duration, 10);
      adFirstQuartile = Math.floor(duration / 4);
      adTimeFlag = false;
    }
    if (
      adTimeProgressMatch(adTimeObject.position, adFirstQuartile) ||
      adTimeProgressMatch(adTimeObject.position, adFirstQuartile * 2) ||
      adTimeProgressMatch(adTimeObject.position, adFirstQuartile * 3) ||
      adTimeProgressMatch(adTimeObject.position, adtime)
    ) {
      permutiveEventTracking('VideoAdProgress', {
        progress: adTimeObject.position,
        video: {
          duration: duration,
          name: title,
          custom_fields: [],
          video_id: current_mediaid,
          description: description,
          tags: tags,
          watch_count: 1,
          created_at: updated_at,
          published_at: pub_date,
        },
        ad: {
          duration: adtime,
          advertiser_name: '',
          ad_system: adsystem,
          description: '',
          universal_ad_id_registry: '',
          creative_id: '',
          ad_id: '',
          min_suggested_duration: 30,
          title: adtitle,
          universal_ad_id: '',
          deal_id: '',
        },
        play_id: playSessionId,
      });
    }
  });

  jwplayer(containerId).on('adPlay', function () {
    permutiveEventTracking('VideoAdPlay', {
      ad: {
        duration: adtime,
        advertiser_name: '',
        ad_system: adsystem,
        description: 'ad',
        universal_ad_id_registry: '',
        creative_id: '',
        ad_id: '',
        min_suggested_duration: 30,
        title: adtitle,
        universal_ad_id: '',
        deal_id: '',
      },
      video: {
        duration: duration,
        name: title,
        custom_fields: [],
        video_id: current_mediaid,
        description: description,
        tags: tags,
        watch_count: 1,
        created_at: updated_at,
        published_at: pub_date,
      },
      play_id: playSessionId,
    });
  });

  jwplayer(containerId).on('adClick', function () {
    permutiveEventTracking('VideoAdClick', {
      ad: {
        duration: adtime,
        advertiser_name: '',
        ad_system: adsystem,
        description: 'Ad',
        universal_ad_id_registry: '',
        creative_id: '',
        ad_id: '',
        min_suggested_duration: 30,
        title: adtitle,
        universal_ad_id: '',
        deal_id: '',
      },
      video: {
        name: adtitle,
        custom_fields: [],
        video_id: current_mediaid,
        description: adclickthroughurl,
        tags: tags,
        watch_count: 1,
        created_at: updated_at,
        published_at: now,
      },
      client: {
        url: window.location.href,
        type: 'web',
        domain: window.location.hostname,
        user_agent: navigator.userAgent,
      },
      play_id: playSessionId,
    });
  });
};

const jwplayerSetupWithPermutive = (props) => {
  addWatchingThat();
  addMoat();
  //Player initialisation, inside the Permutive readyWithTimeout function, to start the player when Permutive segments are available
  if (permutiveEnabled) {
    permutive.readyWithTimeout(
      jwplayerSetup.bind(this, props),
      'realtime',
      2500,
    );
  } else {
    jwplayerSetup(props);
  }
};

export default (permutiveConsent) => {
  permutiveEnabled = permutiveConsent && window.JSGlobals.permutive;
  permutiveEnabled && initPermutiveReadyWithTimeout();

  if (typeof jwplayer === 'function') {
    //jwplayer already loaded, therefore event has already fired; too late to set up a listener
    //get set-up parameters from data attributes on jwplayer script tag
    const scripts = document.querySelectorAll('script[data-jwplayer-uid]');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i] && scripts[i].dataset.jwplayerUid) {
        const containerId = scripts[i].dataset.jwplayerUid;
        const playerType = scripts[i].dataset.jwplayerPlayerType;
        const options = JSON.parse(scripts[i].dataset.jwplayerData);
        jwplayerSetupWithPermutive({
          containerId,
          playerType,
          options,
        });
      }
    }
  } else {
    //jwplayer not loaded yet, set up a listener for the event that will be dispatched once it loads
    //get set-up parameters from event
    document.addEventListener('jwplayerLoaded', (event) => {
      const containerId = event.detail.uid;
      const playerType = event.detail.playerType;
      const options = event.detail.data;
      jwplayerSetupWithPermutive({
        containerId,
        playerType,
        options,
      });
    });
  }
};
