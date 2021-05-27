import { FormState } from '../../FormState';
import {
  watchNewsletters,
  NEWSLETTER_CHECKBOX_SELECTOR,
} from '../watchNewsletters';

describe('watchNewsletters()', () => {
  let mockUpdateSelectedNewsletters;
  let state;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="alpha">
        <input
          class="newsletter-page-select-checkbox"
         name="alpha" type="checkbox"/>
      </div>
      <div id="beta">
        <input
          class="newsletter-page-select-checkbox"
          name="beta" type="checkbox"/>
      </div>
      <div id="gamma">
        <input
          class="newsletter-page-select-checkbox"
          name="gamma" type="checkbox"/>
      </div>
    `;

    state = new FormState();
    mockUpdateSelectedNewsletters = jest.fn();
    state.updateSelectedNewsletters = mockUpdateSelectedNewsletters;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when `intransit` newsletters array changes', () => {
    beforeEach(() => {
      watchNewsletters(state);

      state.data.newsletters.intransit = ['alpha', 'beta'];

      state.digest();
    });

    it('should add `subscribed` class to each corresponding card', () => {
      const alphaCardEl = document.getElementById('alpha');
      expect(alphaCardEl.classList.contains('subscribed')).toBe(true);

      const betaCardEl = document.getElementById('beta');
      expect(betaCardEl.classList.contains('subscribed')).toBe(true);

      const gammaCardEl = document.getElementById('gamma');
      expect(gammaCardEl.classList.contains('subscribed')).toBe(false);
    });

    it('should deactivate checkbox for newsletter that is in `intransit` array', () => {
      const alphaCheckbox = document
        .getElementById('alpha')
        .querySelector(NEWSLETTER_CHECKBOX_SELECTOR);

      alphaCheckbox.dispatchEvent(new Event('change'));

      expect(mockUpdateSelectedNewsletters.mock.calls.length).toBe(0);
    });

    it('should deactivate checkbox for newsletter that is in `intransit` array', () => {
      const betaCheckbox = document
        .getElementById('beta')
        .querySelector(NEWSLETTER_CHECKBOX_SELECTOR);

      betaCheckbox.dispatchEvent(new Event('change'));

      expect(mockUpdateSelectedNewsletters.mock.calls.length).toBe(0);
    });

    it('should NOT deactivate checkbox for newsletter that is NOT in `intransit` array', () => {
      const gammaCheckbox = document
        .getElementById('gamma')
        .querySelector(NEWSLETTER_CHECKBOX_SELECTOR);

      gammaCheckbox.dispatchEvent(new Event('change'));

      expect(mockUpdateSelectedNewsletters.mock.calls.length).toBe(1);
    });
  });

  describe('when `selected` newsletters array changes', () => {
    beforeEach(() => {
      watchNewsletters(state);

      // First, put newsletter into `intransit` array. This will remove the
      // event listener and add the `subscribed` class
      state.data.newsletters.intransit = ['gamma'];
      state.digest();

      state.data.newsletters.selected = ['gamma'];
      state.digest();
    });

    it('should remove `subscribed` class from corresponding card', () => {
      const gammaCardEl = document.getElementById('gamma');
      expect(gammaCardEl.classList.contains('subscribed')).toBe(false);
    });

    it('should re-enable checkbox for newsletter in `selected` array', () => {
      const gammaCheckbox = document
        .getElementById('gamma')
        .querySelector(NEWSLETTER_CHECKBOX_SELECTOR);

      gammaCheckbox.dispatchEvent(new Event('change'));

      expect(mockUpdateSelectedNewsletters.mock.calls.length).toBe(1);
    });
  });
});
