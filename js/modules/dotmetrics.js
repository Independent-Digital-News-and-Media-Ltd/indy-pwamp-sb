/*globals dm,DotMetricsObj,JSGlobals*/

import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

export default () => {
  window.dm = window.dm || { AjaxData: [] };
  window.dm.AjaxEvent = function (et, d, ssid, ad) {
    dm.AjaxData.push({ et: et, d: d, ssid: ssid, ad: ad });
    window.DotMetricsObj && DotMetricsObj.onAjaxDataUpdate();
  };
  JSGlobals.dotmetrics.sectionId &&
    jsLoader([
      `https://uk-script.dotmetrics.net/door.js?id=${JSGlobals.dotmetrics.sectionId}`,
    ]);
};
