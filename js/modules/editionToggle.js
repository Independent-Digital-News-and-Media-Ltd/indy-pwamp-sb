export default () => {
  const editionMenu = document.getElementById('edition-menu');
  const toggleBtnId = 'edition-toggle';

  window.addEventListener(
    'click',
    (e) => {
      if (e.target.id === toggleBtnId) {
        editionMenu.classList.toggle('show');
      } else if (editionMenu.classList.contains('show')) {
        editionMenu.classList.remove('show');
      }
    },
    true,
  );
};
