/* globals googletag, JSGlobals */
import gpt from './gpt';
import { getCookie } from './cookie';

import { adConfig } from '../../../config/ads';
import { breakPoints } from '../../../config/theme/Styles';
import { requestBids } from './prebid';

const addPermutiveTargeting = () => {
  if (!googletag.pubads().getTargeting('permutive').length) {
    const kvs = localStorage.getItem('_pdfps');
    googletag.pubads().setTargeting('permutive', kvs ? JSON.parse(kvs) : []);
  }
};

const addAutoRefreshTargeting = () => {
  googletag
    .pubads()
    .setTargeting(
      'autorefresh',
      window.location.href.includes('CMP=ILC-refresh') ? 'yes' : 'no',
    );
};

const addGDPRTargeting = () => {
  googletag.pubads().setTargeting('gdpr', getCookie('gdpr', 'none'));
};

const addGDPRConcentTargeting = () => {
  googletag
    .pubads()
    .setTargeting('gdpr_consent', getCookie('euconsent-v2', 'none'));
};

const addAddtlConsent = () => {
  // @see https://support.google.com/admanager/answer/9681920?hl=en
  googletag
    .pubads()
    .setTargeting('addtl_consent', getCookie('addtl_consent', ''));
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

export default (props) => {
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
      addAutoRefreshTargeting();
      addGDPRTargeting();
      addGDPRConcentTargeting();
      addAddtlConsent();
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
