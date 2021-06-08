/**
 * @jest-environment jsdom
 */

import { watchErrorMessage, ERROR_CLASS } from '../watchErrorMessage';

import { INPUT_WIDGET_ID, ERROR_MESSAGE_ID } from '../../constants';

import { FormState } from '../../FormState';

describe('watchErrorMessage()', () => {
  let errorMessageEl;
  let inputWidgetEl;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="${ERROR_MESSAGE_ID}"></div>
      <div id="${INPUT_WIDGET_ID}"></div>
    `;

    errorMessageEl = document.getElementById(ERROR_MESSAGE_ID);
    inputWidgetEl = document.getElementById(INPUT_WIDGET_ID);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when `textContent` is set', () => {
    const ERROR_MESSAGE_TEXT = 'an error happened';

    beforeEach(() => {
      const state = new FormState();
      watchErrorMessage(state);

      state.data.errorMessage = ERROR_MESSAGE_TEXT;
      state.digest();
    });

    it('should set error message', () => {
      expect(errorMessageEl.textContent).toBe(ERROR_MESSAGE_TEXT);
    });

    it('should add `is-error` class to input widget', () => {
      expect(inputWidgetEl.classList.contains(ERROR_CLASS)).toBe(true);
    });
  });

  describe('when `textContent` is NOT set', () => {
    beforeEach(() => {
      const state = new FormState();
      watchErrorMessage(state);

      state.data.errorMessage = 'some error';
      state.digest();

      state.data.errorMessage = '';
      state.digest();
    });

    it('should unset error message', () => {
      expect(errorMessageEl.textContent).toBe('');
    });

    it('should remove `is-error` class from  input widget', () => {
      expect(inputWidgetEl.classList.contains(ERROR_CLASS)).toBe(false);
    });
  });
});
