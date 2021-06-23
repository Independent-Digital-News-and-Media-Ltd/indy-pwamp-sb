/* globals googletag, JSGlobals */
import gpt from './gpt';
import { getCookie } from './cookie';

import { adConfig } from '../../../config/ads';
import { breakPoints } from '../../../config/theme/Styles';
import { requestBids } from './prebid';
import { delayForMoatTargeting } from './moat';

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

const addCampaignOverrideTargeting = () => {
  if (!window.location.search) {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const campaignId = searchParams.get('campaign-override')?.trim();

  if (campaignId) {
    googletag.pubads().setTargeting('display_test', campaignId);
  }
};

const addRegGateStatus = (hasRegGate) => {
  googletag.pubads().setTargeting('reg_gate', String(hasRegGate));
};

export default ({ refresh, hasRegGate, ...props }) => {
  gpt({
    ...props,
    adConfig,
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

      addRegGateStatus(hasRegGate);
      addPermutiveTargeting();
      addAutoRefreshTargeting(refresh);
      addGDPRTargeting();
      addTopicsTargeting();
      addGSTargeting();
      addCampaignOverrideTargeting();
    },
    beforeSlotsDisplay: async (slots, done) => {
      if (!window.moatTargetingSet) {
        await delayForMoatTargeting();
      }
      if (props.prebidEnabled) {
        return requestBids(slots, done);
      }
      done();
    },
  });
};
