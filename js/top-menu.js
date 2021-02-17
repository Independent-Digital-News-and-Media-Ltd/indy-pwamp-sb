export default () => {
  let scrollY = null;
  const headerElem = document.getElementsByTagName('header')[0];
  const menuHeaderDiv = document.querySelector('#header>div');
  const persistentPlayerElem = document.querySelector('.video-sticky-video');
  let scrollDirection = null;
  let maxDown = scrollY;
  let maxUp = 0;
  let currentMenuTop = 0;

  if (headerElem && menuHeaderDiv && persistentPlayerElem) {
    window.onscroll = () => {
      const newScrollDirection = scrollY < window.scrollY ? 'down' : 'up';
      scrollY = Math.max(window.scrollY, 0);
      const headerHeight = headerElem.offsetHeight;

      if (window.pageYOffset >= 10) {
        menuHeaderDiv.classList.add('hideTopMenu');
        persistentPlayerElem.style.top = '39px';
      } else if (window.pageYOffset === 0) {
        menuHeaderDiv.classList.remove('hideTopMenu');
      }

      if (currentMenuTop + headerHeight > scrollY && currentMenuTop < scrollY) {
        scrollDirection = newScrollDirection;
        if (scrollDirection === 'up') {
          maxUp = 0;
        }
        persistentPlayerElem.style.top = '39px';
        return;
      }

      if (newScrollDirection === 'down') {
        maxDown = scrollY;

        if (maxUp > scrollY - headerHeight) {
          currentMenuTop = maxUp;
        }
      } else {
        maxUp = scrollY;

        if (newScrollDirection !== scrollDirection) {
          currentMenuTop = maxDown - headerHeight;
        } else {
          currentMenuTop = 0;
          headerElem.style.position = 'fixed';
          headerElem.style.top = '0px';
          persistentPlayerElem.style.top = '39px';
        }
      }

      scrollDirection = newScrollDirection;
    };
  }
};
