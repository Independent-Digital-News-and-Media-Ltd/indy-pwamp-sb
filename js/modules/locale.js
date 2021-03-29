import { setCookie } from './cookie';

export default () => {
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
