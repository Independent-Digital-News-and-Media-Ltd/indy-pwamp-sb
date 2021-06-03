import { openLoginSidebar } from '../loginSidebar';
import { REGISTER_LINK_ID, LOGIN_BUTTON_ID } from '../../../../constants/ids';
import mockWindowProperty from '../../__fixtures__/mockWindowProperty';

describe('openLoginSidebar()', () => {
  let loginButton;
  let registerLink;
  let mockLoginButtonEventHandler;
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="${LOGIN_BUTTON_ID}"></button>
      <a id="${REGISTER_LINK_ID}" href=""></a>
    `;

    mockLoginButtonEventHandler = jest.fn();

    loginButton = document.getElementById(LOGIN_BUTTON_ID);
    registerLink = document.getElementById(REGISTER_LINK_ID);

    loginButton.addEventListener('click', mockLoginButtonEventHandler);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when regSourceMethod is passed and value is `Commenting`', () => {
    mockWindowProperty('localStorage', {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    });
    beforeEach(() => {
      openLoginSidebar('Commenting');
    });

    it('should call localStorage and expect the value of `regSourceMethod` to be  `Commenting`', () => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'regSourceMethod',
        'Commenting',
      );
    });

    it('should call localStorage and expect the value of `returnUrl` to be  `window.location.href`', () => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'returnUrl',
        window.location.href,
      );
    });
  });

  describe('when regSourceMethod is passed', () => {
    beforeEach(() => {
      openLoginSidebar('test blah');
    });

    it('should call login button event handler', () => {
      expect(mockLoginButtonEventHandler).toHaveBeenCalled();
    });

    it('should set `regSourceMethod` parameter in register href', () => {
      expect(registerLink.getAttribute('href')).toBe(
        '/register?regSourceMethod=test+blah',
      );
    });
  });

  describe('when regSourceMethod is NOT passed', () => {
    beforeEach(() => {
      openLoginSidebar();
    });

    it('should call login button event handler', () => {
      expect(mockLoginButtonEventHandler).toHaveBeenCalled();
    });

    it('should NOT set `regSourceMethod` parameter in register href', () => {
      expect(registerLink.getAttribute('href')).toBe('/register');
    });
  });
});
