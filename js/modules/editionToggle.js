export const TOGGLE_BUTTON_ID = 'edition-toggle';
export const EDITION_MENU_ID = 'edition-menu';
export const SHOW_CLASS = 'show';

export default () => {
  const toggleButton = document.getElementById(TOGGLE_BUTTON_ID);
  const editionMenu = document.getElementById(EDITION_MENU_ID);

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      editionMenu.classList.toggle(SHOW_CLASS);
    });

    window.addEventListener('click', (event) => {
      if (!toggleButton.contains(event.target)) {
        editionMenu.classList.remove(SHOW_CLASS);
      }
    });
  }
};
