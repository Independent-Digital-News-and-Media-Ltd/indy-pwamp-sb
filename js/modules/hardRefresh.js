import { storeDigitalData, removeDigitalDataByKeys } from './digitalData';

const digitalDataKey = 'auto_refresh';

export default () => {
  // Utility function to update querystring
  // https://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter/11654596#11654596
  function updateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    let re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi'),
      hash;
    if (re.test(url)) {
      if (typeof value !== 'undefined' && value !== null) {
        return url.replace(re, '$1' + key + '=' + value + '$2$3');
      } else {
        hash = url.split('#');
        url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
          url += '#' + hash[1];
        }
        return url;
      }
    } else {
      if (typeof value !== 'undefined' && value !== null) {
        let separator = url.indexOf('?') !== -1 ? '&' : '?';
        hash = url.split('#');
        url = hash[0] + separator + key + '=' + value;
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
          url += '#' + hash[1];
        }
        return url;
      } else {
        return url;
      }
    }
  }

  const refreshTime = 150 * 1000;
  let refreshInit;

  const initRefresh = () => {
    removeDigitalDataByKeys([digitalDataKey]);
    clearInterval(refreshInit);

    refreshInit = setTimeout(() => {
      storeDigitalData({ [digitalDataKey]: true });
      if (window.location.href.includes('CMP=ILC-refresh')) {
        window.location.href = location.href;
      } else {
        window.location.href = updateQueryString(
          'CMP',
          'ILC-refresh',
          window.location.href,
        );
      }
    }, refreshTime);
  };

  document.addEventListener('keypress', initRefresh);
  document.addEventListener('click', initRefresh);
  document.addEventListener('mousemove', initRefresh);
  document.addEventListener('scroll', initRefresh);
  initRefresh();
};
