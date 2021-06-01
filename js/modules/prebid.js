/* globals pbjs */
import {
  adsList,
  priceGranularity,
  bidders,
} from '../../../config/vendors/prebid';

const PREBID_TIMEOUT = 1500;

const formatSizes = (sizeObj) =>
  sizeObj.map((item) => ({
    minViewPort: [item.from, 0],
    sizes: item.supportedSizes,
  }));

const formatBids = ({ id, bidders }) => {
  return bidders
    .filter((bidder) => bidder.adIds[id])
    .map((bidder) => bidder.params({ id }));
};

export const adsForBidding = ({ ads, bidders }) => {
  const ids = bidders
    .map((bidder) => bidder.adIds)
    .reduce((acc, val) => ({ ...acc, ...val }));
  return ads.filter((ad) => ids[ad.id]);
};

export const prebidAdConfig = (ads, bidders) => {
  return adsForBidding({ ads, bidders }).map(({ id, sizes, video }) => {
    return {
      code: id,
      mediaTypes: {
        ...(video
          ? { video }
          : {
              banner: {
                sizeConfig: formatSizes(sizes),
              },
            }),
      },
      bids: formatBids({ id, bidders }),
    };
  });
};

const biddableAds = adsForBidding({ ads: adsList, bidders });

const requestBids = (gptSlots, done) => {
  const adsToAuction = gptSlots.filter((slot) =>
    biddableAds.find((ad) => ad.id === slot.id),
  );

  if (!(adsToAuction.length > 0)) {
    done();
    return;
  }
  const adUnitCodes = adsToAuction.map((ad) => ad.id);
  pbjs.que.push(() => {
    pbjs.requestBids({
      timeout: PREBID_TIMEOUT,
      adUnitCodes,
      bidsBackHandler: () => {
        adsToAuction.forEach((ad) => {
          pbjs.setTargetingForGPTAsync([ad.id]);
        });
        done();
      },
    });
  });
};

let prebidInitialised = false;

const prebidInit = () =>
  new Promise((resolve) => {
    if (prebidInitialised) {
      resolve();
      return;
    }
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
                name: '_pubcid',
                expires: 90,
              },
            },
          ],
          filterSettings: {
            iframe: {
              bidders: bidders.map((bidder) => bidder.bidderName),
              filter: 'include',
            },
          },
        },
      });

      pbjs.addAdUnits(prebidAdConfig(adsList, bidders));

      resolve();
    });
  });

export { requestBids };
export default prebidInit;
