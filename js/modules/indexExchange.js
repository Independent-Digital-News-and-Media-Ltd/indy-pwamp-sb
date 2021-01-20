/* globals JSGlobals */
import { getCookie } from './cookie';

const setUserValues = () => {
  const topics = JSGlobals.topictags || [];
  const permutive = JSON.parse(localStorage.getItem('_pdfps') || '[]');
  const psegs = JSON.parse(localStorage.getItem('_psegs') || '[]')
    .map(Number)
    .filter((seg) => seg >= 1000000)
    .map(String);
  const ppam = JSON.parse(window.localStorage._ppam || '[]');
  const p_standard = psegs.concat(ppam);

  window.headertag.setUserKeyValueData({
    segments: {
      permutive,
      p_standard,
    },
    keywords: topics,
  });
};

const setSiteValues = () => {
  window.headertag.setSiteKeyValueData({
    ext: {
      indexexchange: {
        pageType: JSGlobals.pageType,
        gdpr: getCookie('gdpr', 'none'),
        gdpr_consent: getCookie('euconsent-v2', 'none'),
        gs_channels: JSGlobals.gs_channels,
      },
    },
  });
};

export default () => {
  window.headertag = window.headertag || {};
  window.headertag.cmd = window.headertag.cmd || [];
  window.headertag.cmd.push(() => {
    setUserValues();
    setSiteValues();
  });
};
