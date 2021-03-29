/*globals google*/
const initGoogleSearch = (cx) =>
  new Promise((resolve) => {
    if (!cx) {
      resolve();
      return;
    }

    const gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);

    const searchElement = 'searchBox0';

    const renderSearchElement = function () {
      google.search.cse.element.render(
        {
          div: searchElement,
          tag: 'searchbox',
          gname: 'searchbox-only0',
        },
        {
          div: 'quickSearchresults0',
          tag: 'searchresults-only',
          gname: 'searchbox-only0',
        },
      );
      google.search.cse.element.render(
        {
          div: 'searchBox1',
          tag: 'searchbox',
          gname: 'searchbox-only1',
        },
        {
          div: 'quickSearchresults1',
          tag: 'searchresults-only',
          gname: 'searchbox-only1',
        },
      );

      resolve();
    };

    const callback = function () {
      if (typeof document.getElementById(searchElement) !== 'undefined') {
        renderSearchElement();
        // document.getElementById('gsc-i-id1').placeholder = ' Custom Search';
      } else {
        google.setOnLoadCallback(renderSearchElement, true);
      }
    };

    window.__gcse || (window.__gcse = {});
    window.__gcse = Object.assign(window.__gcse, {
      parsetags: 'explicit',
      callback: callback,
    });
  });

export default initGoogleSearch;
