import { setCookie } from './cookie';

const addEditionClickEventListeners = () => {
  const dataEditionNodeList = document.querySelectorAll('[data-edition]');
  [...dataEditionNodeList].forEach((el) => {
    el.addEventListener('click', ({ currentTarget: link }) => {
      const locale = link.getAttribute('data-edition');
      if (locale) {
        setCookie('Locale', locale);
      }
    });
  });
};

export default () => {
  addEditionClickEventListeners();
  // if some edition links are loaded dynamically
  // we need to observe its parent mutation and trigger addEditionClickEventListeners again
  const target = document.querySelector('#full-menu');
  if (target) {
    const config = {
      childList: true,
      subtree: true,
    };
    const callback = () => {
      addEditionClickEventListeners();
    };
    const observer = new MutationObserver(callback);
    observer.observe(target, config);
  }
};
