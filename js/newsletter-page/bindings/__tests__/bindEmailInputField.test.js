import { FormState } from '../../FormState';
import { bindEmailInputField } from '../bindEmailInputField';

jest.mock('../../FormState');
jest.mock('../../utils/isEmailValid', () => ({
  isEmailValid: () => true,
}));

describe('bindEmailInputField()', () => {
  let emailField;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="email-input-field"/>
    `;

    emailField = document.getElementById('email-input-field');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when blur event is fired on field', () => {
    it('should mark field as touched', () => {
      const mockMarkEmailFieldTouched = jest.fn();
      const state = new FormState();
      state.markEmailFieldTouched = mockMarkEmailFieldTouched;

      bindEmailInputField(state);
      emailField.dispatchEvent(new Event('blur'));

      expect(mockMarkEmailFieldTouched.mock.calls.length).toBe(1);
    });
  });

  describe('when change event is fired on field', () => {
    it('should mark field as `dirty`', () => {
      const mockMarkEmailFieldDirty = jest.fn();
      const state = new FormState();
      state.markEmailFieldDirty = mockMarkEmailFieldDirty;

      bindEmailInputField(state);
      emailField.dispatchEvent(new Event('change'));

      expect(mockMarkEmailFieldDirty.mock.calls.length).toBe(1);
    });
  });

  describe('when input event is fired on field', () => {
    it('should set email in state', () => {
      const mockSetEmail = jest.fn();
      const state = new FormState();
      state.setEmail = mockSetEmail;

      bindEmailInputField(state);
      emailField.value = 'foobar';
      emailField.dispatchEvent(new Event('input'));

      expect(mockSetEmail.mock.calls.length).toBe(1);
      expect(mockSetEmail.mock.calls[0][0]).toBe('foobar');
      expect(mockSetEmail.mock.calls[0][1]).toBe(true);
    });
  });
});
