/*globals dm, DotMetricsObj, JSGlobals*/
import { loadJS } from './util';
import { getCookie } from './cookie';

export default async () => {
  if (getCookie('subscriber_origin') === 'us') {
    return;
  }
  window.dm = window.dm || { AjaxData: [] };
  window.dm.AjaxEvent = function (et, d, ssid, ad) {
    dm.AjaxData.push({ et: et, d: d, ssid: ssid, ad: ad });
    window.DotMetricsObj && DotMetricsObj.onAjaxDataUpdate();
  };
  if (JSGlobals?.dotmetrics?.sectionId) {
    await loadJS([
      `https://uk-script.dotmetrics.net/door.js?id=${JSGlobals.dotmetrics.sectionId}`,
    ]);
  }
};
