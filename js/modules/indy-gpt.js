/* globals googletag, JSGlobals, permutive */
import gpt from './gpt';
import { getCookie } from './cookie';
import { initPermutiveReadyWithTimeout } from './permutive';

import { adConfig } from '../../../config/ads';
import { breakPoints } from '../../../config/theme/Styles';
import { requestBids } from './prebid';

const addPermutiveTargeting = () => {
  if (!googletag.pubads().getTargeting('permutive').length) {
    const kvs = localStorage.getItem('_pdfps');
    googletag.pubads().setTargeting('permutive', kvs ? JSON.parse(kvs) : []);
  }
};

const addAutoRefreshTargeting = (refresh) => {
  googletag.pubads().setTargeting('autorefresh', refresh ? 'yes' : 'no');
};

const addGDPRTargeting = () => {
  googletag.pubads().setTargeting('gdpr', getCookie('gdpr', 'none'));
};

const addTopicsTargeting = () => {
  const topics = JSGlobals.topictags || [];

  if (!topics.length) {
    return;
  }

  googletag.pubads().setTargeting('topictags', topics);
};

const addGSTargeting = () => {
  if (JSGlobals.gs_channels?.length) {
    googletag.pubads().setTargeting('gs_channels', JSGlobals.gs_channels);
  }
};

const gptSetup = ({ refresh, ...props }) => {
  gpt({
    ...props,
    adConfig: adConfig(JSGlobals.domain),
    breakPoints,
    setTargeting: () => {
      const adTargeting = { pageType: JSGlobals.pageType };

      if (JSGlobals.article) {
        // KIWI-1674 - strip anything non numeric from article id
        adTargeting.article = JSGlobals.pageId.replace(/\D/g, '');
      }

      Object.keys(adTargeting).forEach((key) => {
        googletag.pubads().setTargeting(key, adTargeting[key]);
      });

      addPermutiveTargeting();
      addAutoRefreshTargeting(refresh);
      addGDPRTargeting();
      addTopicsTargeting();
      addGSTargeting();
    },
    beforeSlotsDisplay: (slots, done) => {
      if (props.prebidEnabled) {
        return requestBids(slots, done);
      }
      done();
    },
  });
};

export default (props) => {
  const { consent } = props;
  const permutiveEnabled = consent && window.JSGlobals.permutive;
  if (permutiveEnabled) {
    initPermutiveReadyWithTimeout();
    permutive.readyWithTimeout(gptSetup.bind(this, props), 'realtime', 2500);
  } else {
    gptSetup(props);
  }
};
