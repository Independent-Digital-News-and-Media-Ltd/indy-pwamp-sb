import { setCookie } from './cookie';

export default () => {
  const dataEditionNodeList = document.querySelectorAll('[data-edition]');
  [...dataEditionNodeList].forEach((el) => {
    el.addEventListener('click', function (e) {
      const link = e.currentTarget;
      const locale = link.getAttribute('data-edition');
      if (locale) {
        setCookie('Locale', locale);
      }
    });
  });
};
