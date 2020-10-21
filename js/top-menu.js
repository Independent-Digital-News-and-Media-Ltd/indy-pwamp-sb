(() => {
  let scrollY = null;
  const headerElem = document.getElementsByTagName('header')[0];
  const persistentPlayerElem = document.querySelector('.video-sticky-video');
  let scrollDirection = null;
  let maxDown = scrollY;
  let maxUp = 0;
  let currentMenuTop = 0;

  window.onscroll = () => {
    const newScrollDirection = scrollY < window.scrollY ? 'down' : 'up';
    scrollY = Math.max(window.scrollY, 0);
    const headerHeight = headerElem.offsetHeight;

    if (newScrollDirection === 'down') {
      headerElem.style.position = 'absolute';
    }

    if (currentMenuTop + headerHeight > scrollY && currentMenuTop < scrollY) {
      scrollDirection = newScrollDirection;
      if (scrollDirection === 'up') {
        maxUp = 0;
      }
      persistentPlayerElem.style.top = '0px';
      return;
    }

    if (newScrollDirection === 'down') {
      maxDown = scrollY;

      if (maxUp > scrollY - headerHeight) {
        headerElem.style.top = `${maxUp}px`;
        currentMenuTop = maxUp;
      }
    } else {
      maxUp = scrollY;

      if (newScrollDirection !== scrollDirection) {
        currentMenuTop = maxDown - headerHeight;
        headerElem.style.position = 'relative';
        headerElem.style.top = `${maxDown - headerHeight}px`;
      } else {
        currentMenuTop = 0;
        headerElem.style.position = 'fixed';
        headerElem.style.top = '0px';
        persistentPlayerElem.style.top = '86px';
      }
    }

    scrollDirection = newScrollDirection;
  };
})();
