/* globals googletag */
import { getWindowWidth } from './util';

const createAd = (id, size, adUnitPath) => {
  const conditionalAdElem = document.createElement('div');
  conditionalAdElem.id = id;
  conditionalAdElem.setAttribute('data-mpu', 'true');
  conditionalAdElem.setAttribute('data-size', size);
  conditionalAdElem.setAttribute('data-ad-unit-path', adUnitPath);
  conditionalAdElem.className = 'extraAd';
  return conditionalAdElem;
};

const isHidden = (el) =>
  !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

export default ({
  adConfig,
  breakPoints,
  beforeSlotsDisplay = (slots, done) => {
    done();
  },
  ...props
}) => {
  const currentAds = {};
  const refreshIndexes = {};
  const adsToDisplay = [];

  const findUninitialisedVisibleMPUs = () =>
    [
      ...document.querySelectorAll('[data-mpu]:not([data-initialised="true"])'),
    ].filter((mpu) => !isHidden(mpu));

  const findMPUsForRefeshCheck = () =>
    document.querySelectorAll('[data-mpu][data-refresh-check="true"][id]');

  const getConfig = (mpuName, pageWidth) => {
    const { size } = adConfig;
    const mpuSizeConfig = size[mpuName];

    if (mpuSizeConfig) {
      const config = [...mpuSizeConfig]
        .reverse()
        .find((item) => item.from <= pageWidth);

      if (config) {
        return config;
      }
    }
  };

  const getSizeFromConfig = (mpuName, pageWidth) => {
    const config = getConfig(mpuName, pageWidth);
    return config ? config.supportedSizes : null;
  };

  const getSizeFromAttributes = (el, width) => {
    if (width >= breakPoints.laptop && el.dataset.desktopSizes) {
      return el.dataset.desktopSizes;
    }
    if (width >= breakPoints.tablet && el.dataset.tabletSizes) {
      return el.dataset.tabletSizes;
    }
    if (width < breakPoints.tablet && el.dataset.mobileSizes) {
      return el.dataset.mobileSizes;
    }
    if (el.dataset.sizes) {
      return el.dataset.sizes;
    }
  };

  const getAdSizes = (el, width) => {
    if (el.dataset.sizeKey) {
      const sizeArr = getSizeFromConfig(el.dataset.sizeKey, width);
      sizeArr ||
        console.warn(`Incorrect Ad size detected: ${el.dataset?.tileName}`);
      return sizeArr
        ? {
            str: sizeArr.map((size) => size.join('x')).join('|'),
            arr: sizeArr,
          }
        : null;
    }

    const sizeString = getSizeFromAttributes(el, width) || '300x250';

    return {
      str: sizeString,
      arr: sizeString
        .split('|')
        .map((size) => size.split('x').map((dimension) => Number(dimension))),
    };
  };

  const createSlot = (adUnitPath, size, id, targeting = {}) =>
    googletag
      .defineSlot(adUnitPath, size, id)
      .setCollapseEmptyDiv(true)
      .updateTargetingFromMap(targeting)
      .addService(googletag.pubads());

  const initialiseAd = (el) => {
    const sizes = getAdSizes(el, getWindowWidth());

    const slot = sizes?.arr?.length
      ? createSlot(el.dataset.adUnitPath, sizes.arr, el.id, { tile: el.id })
      : null;

    if (slot) {
      currentAds[el.id] = { el, slot, sizes: sizes.str };
    }
  };

  const displayAds = () => {
    const ads = [...adsToDisplay];
    adsToDisplay.length = 0;

    if (ads.length) {
      beforeSlotsDisplay(ads, () => {
        ads.forEach((el) => {
          googletag.cmd.push(() => {
            googletag.display(el.id);
          });
        });
      });
    }
  };

  const adObserver = new IntersectionObserver(
    (items) => {
      const intersectingItems = items.filter((item) => item.isIntersecting);

      intersectingItems.forEach(({ target: el }) => {
        adObserver.unobserve(el);
        initialiseAd(el);
        adsToDisplay.push(el);
      });

      displayAds();
    },
    { rootMargin: '150px' },
  );

  const getAdRefreshIndex = (el) =>
    Number(document.getElementById(`${el.id}_adIndex`).innerHTML);

  const destroyAd = (el) => {
    if (currentAds[el.id].slot) {
      googletag.destroySlots([currentAds[el.id].slot]);
    }
    el.setAttribute('data-initialised', 'false');
    el.removeAttribute('id');
    delete currentAds[el.id];
  };

  const createAdUnitPathFromOther = (adUnitPath, adId) =>
    [...adUnitPath.split('/').slice(0, -1), adId].join('/');

  const checkForConditionalAd = (evt) => {
    const slotId = evt.slot.getSlotElementId();
    const slotElem = document.getElementById(slotId);

    if (slotElem?.dataset.sizeKey) {
      const { conditionalAd } = getConfig(
        slotElem.dataset.sizeKey,
        getWindowWidth(),
      );

      if (conditionalAd && conditionalAd.if.join('x') === evt.size.join('x')) {
        const mpuId = `${slotId}${conditionalAd.tileNameExtra}`;

        slotElem.parentElement.appendChild(
          createAd(
            mpuId,
            '300x250',
            createAdUnitPathFromOther(slotElem.dataset.adUnitPath, mpuId),
          ),
        );
      }
    }
  };

  const loadOutOfPageAd = () => {
    const outOfPageAdId = 'outofpageslot';
    const existingAd = document.querySelector('[data-mpu]');

    // only load if there are other ads on page
    if (existingAd) {
      googletag
        .defineOutOfPageSlot(
          createAdUnitPathFromOther(
            existingAd.dataset.adUnitPath,
            outOfPageAdId,
          ),
          outOfPageAdId,
        )
        .addService(googletag.pubads());
    }
  };

  const gpt = ({
    consent,
    refresh,
    slotRenderedCallback = () => {},
    slotLoadedCallback = () => {},
    setTargeting = () => {},
  }) => {
    googletag.cmd.push(() => {
      setTargeting();

      googletag.pubads().setTargeting('autorefresh', refresh ? 'yes' : 'no');
      googletag.pubads().setCentering(true);
      loadOutOfPageAd();

      if (!consent) {
        googletag.pubads().setRequestNonPersonalizedAds(1);
      }

      googletag.pubads().enableSingleRequest();
      googletag.enableServices();

      let lastPageWidth = getWindowWidth();

      const checkAds = () => {
        const pageWidth = getWindowWidth();

        if (lastPageWidth !== pageWidth) {
          lastPageWidth = pageWidth;
          // check ads to see if current size has changed
          Object.keys(currentAds).forEach((id) => {
            const el = currentAds[id].el;
            const sizes = getAdSizes(el, pageWidth);

            // destroy ad if size has changed & set initalised to false,
            // it will then be initialised as normal below
            if (sizes?.str !== currentAds[id].sizes) {
              destroyAd(el);
            }
          });
        }

        // check ads to see if they require a refresh based on refresh index
        findMPUsForRefeshCheck().forEach((el) => {
          const newIndex = getAdRefreshIndex(el);

          if (
            typeof refreshIndexes[el.id] !== 'undefined' &&
            newIndex !== refreshIndexes[el.id]
          ) {
            refreshIndexes[el.id] = newIndex;
            destroyAd(el);
          }
        });

        let observeCalled = false;

        findUninitialisedVisibleMPUs().forEach((el) => {
          // mark as initialised so not picked up again
          el.setAttribute('data-initialised', 'true');
          if (!el.id) {
            el.setAttribute('id', el.dataset.tileName);
          }
          currentAds[el.id] = { el };

          // if force bulk is set don't bother watching just load straight up
          if (el.dataset.forceBulk === 'true') {
            initialiseAd(el);
            adsToDisplay.push(el);
          } else {
            observeCalled = true;
            adObserver.observe(el);
          }

          if (el.dataset.refreshCheck === 'true') {
            refreshIndexes[el.id] = getAdRefreshIndex(el);
          }
        });

        if (!observeCalled) {
          displayAds();
        }
      };

      checkAds();
      setInterval(checkAds, 100);

      // watch our ads render & check for conditional extra ads to be loaded
      googletag.pubads().addEventListener('slotRenderEnded', (evt) => {
        checkForConditionalAd(evt);
        slotRenderedCallback(evt);
      });

      googletag.pubads().addEventListener('slotOnload', slotLoadedCallback);
    });
  };

  gpt(props);
};
