/* globals pbjs JSGlobals */
import { getAdUnits, priceGranularity } from '../../../config/vendors/prebid';

const PREBID_TIMEOUT = 1500;

let prebidInitialised = false;

const configBase = ({ id, sizes, video, placementId }) => {
  const lotameId = JSGlobals.lotame?.id;
  const testLotameKey = `lotame_${lotameId}_auds`;
  const lotameAuds = localStorage.getItem(testLotameKey) || '';
  const auds = lotameAuds.split(',');
  const pId = localStorage.getItem('_cc_id') || '';

  const permutiveCookie = localStorage.getItem('_pdfps');
  const permutiveData = permutiveCookie ? JSON.parse(permutiveCookie) : [];

  const {
    pageId: article,
    topictags: topics,
    pageType: pagetype,
    gs_channels,
  } = JSGlobals;

  const { publisherId, siteId } = JSGlobals.ozone;

  return {
    code: id,
    mediaTypes: {
      ...(video
        ? { video }
        : {
            banner: {
              sizeConfig: sizes,
            },
          }),
    },
    bids: [
      {
        bidder: 'ozone',
        params: {
          publisherId,
          siteId,
          placementId,
          customData: [
            {
              targeting: {
                lotameSegs: auds,
                lotamePid: pId,
                gs_channels,
                tile: id,
                topics,
                pagetype,
                article,
                permutive: permutiveData,
              },
            },
          ],
          ...(video
            ? {
                video: {
                  skippable: true,
                  playback_method: ['auto_play_sound_off'],
                },
              }
            : {}),
        },
      },
    ],
  };
};

const requestBids = (ads, done) => {
  const adsToAuction = ads.filter((gptAd) => {
    return getAdUnits().find((ad) => ad.id === gptAd.id);
  });

  if (!(adsToAuction.length > 0)) {
    return;
  }
  const adUnitCodes = adsToAuction.map((ad) => ad.id);
  pbjs.que.push(function () {
    pbjs.requestBids({
      timeout: PREBID_TIMEOUT,
      adUnitCodes,
      bidsBackHandler: function () {
        adsToAuction.forEach((ad) => {
          pbjs.setTargetingForGPTAsync([ad.id]);
        });
        done();
      },
    });
  });
};

const prebidInit = (gptCallback) => {
  if (prebidInitialised) return;
  prebidInitialised = true;

  pbjs.que.push(function () {
    pbjs.adserverRequestSent = false;
    pbjs.setConfig({
      consentManagement: {
        gdpr: {
          cmpApi: 'iab',
          defaultGdprScope: true,
          timeout: 6000,
        },
      },
      priceGranularity,
      userSync: {
        userIds: [
          {
            name: 'pubCommonId',
            storage: {
              type: 'cookie',
              name: JSGlobals.ozone.pubcId,
              expires: 90,
            },
          },
        ],
        filterSettings: {
          iframe: {
            bidders: ['ozone'],
            filter: 'include',
          },
        },
      },
    });

    const adConfig = getAdUnits().map((adUnit) => configBase(adUnit));
    pbjs.addAdUnits(adConfig);

    gptCallback();
  });

  return;
};

export { requestBids };
export default prebidInit;
