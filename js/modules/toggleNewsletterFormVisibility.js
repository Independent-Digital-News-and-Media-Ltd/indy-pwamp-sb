export default () => {
  const newsletterComponent = document.querySelector('.newsletter-component');

  if (!newsletterComponent) {
    return;
  }

  const listener = document.addEventListener(
    'readystatechange',
    ({ target }) => {
      if (target.readystate === 'complete') {
        target.removeEventListener('readystatechange', listener);
        newsletterComponent.classList.toggle('hide');
      }
    },
  );
};
