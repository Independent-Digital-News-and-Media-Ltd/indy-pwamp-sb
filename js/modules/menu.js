const menu = (() => {
  const delay = 400;
  const delayHover = 'delay-hover';
  let lastElement;
  let timer = null;
  return {
    watchMouseState(el) {
      el.addEventListener('mouseenter', () => {
        if (lastElement && el.querySelector('ul')) {
          lastElement.classList.remove(delayHover);
        }
      });
      el.addEventListener('mouseleave', () => {
        if (!el.querySelector('ul')) return;
        lastElement = el;
        el.classList.add(delayHover);
        clearTimeout(timer);
        timer = setTimeout(
          () => lastElement.classList.remove(delayHover),
          delay,
        );
      });
    },
  };
})();

export default () => {
  document.querySelectorAll('.menu-navbar-item').forEach(menu.watchMouseState);
};
