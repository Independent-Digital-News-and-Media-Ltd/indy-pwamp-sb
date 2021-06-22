export default () => {
  const articleNextMenu = document.getElementById('article-next-menu');
  if (articleNextMenu) {
    let supportsPassive = false;
    try {
      let opts = Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line
        get: function () {
          supportsPassive = true;
        },
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {
      // noop
    }

    let lastScrollTop = 0;
    const $header = document.getElementById('header');
    const downCls = 'scroll-direction-down';
    const upCls = 'scroll-direction-up';
    window.addEventListener(
      'scroll',
      function () {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st < 900) return;
        if (st > lastScrollTop) {
          $header.classList.remove(upCls);
          $header.classList.add(downCls);
        } else {
          $header.classList.remove(downCls);
          $header.classList.add(upCls);
        }
        lastScrollTop = st <= 0 ? 0 : st;
      },
      supportsPassive ? { passive: true } : false,
    );
  }
};
