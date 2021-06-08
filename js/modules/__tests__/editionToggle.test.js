/**
 * @jest-environment jsdom
 */

import editionToggle, {
  TOGGLE_BUTTON_ID,
  EDITION_MENU_ID,
  SHOW_CLASS,
} from '../editionToggle';

describe('editionToggle()', () => {
  let toggleButton;
  let editionMenu;
  let outsideEl;

  describe('when toggle button is on page', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="outside-el"></div>
        <button id="edition-toggle">
          <ul id="edition-menu">
            <li></li>
          </ul>
        </button>
      `;

      toggleButton = document.getElementById(TOGGLE_BUTTON_ID);
      editionMenu = document.getElementById(EDITION_MENU_ID);
      outsideEl = document.getElementById('outside-el');

      editionToggle();
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    describe('when user clicks on toggle button', () => {
      describe('when edition menu is closed', () => {
        it('should open edition menu', () => {
          editionMenu.classList.remove(SHOW_CLASS);

          toggleButton.click();

          expect(editionMenu.classList.contains(SHOW_CLASS)).toBe(true);
        });
      });

      describe('when edition menu is open', () => {
        it('should close edition menu', () => {
          editionMenu.classList.add(SHOW_CLASS);

          toggleButton.click();

          expect(editionMenu.classList.contains(SHOW_CLASS)).toBe(false);
        });
      });
    });

    describe('when user clicks outside of toggle button', () => {
      describe('when edition menu is closed', () => {
        it('should NOT open edition menu', () => {
          editionMenu.classList.remove(SHOW_CLASS);

          outsideEl.click();

          expect(editionMenu.classList.contains(SHOW_CLASS)).toBe(false);
        });
      });

      describe('when edition menu is open', () => {
        it('should close edition menu', () => {
          editionMenu.classList.add(SHOW_CLASS);

          outsideEl.click();

          expect(editionMenu.classList.contains(SHOW_CLASS)).toBe(false);
        });
      });
    });
  });
});
