import { openLoginSidebar } from '../loginSidebar';

describe('openLoginSidebar()', () => {
  let loginButton;
  let registerLink;
  let mockLoginButtonEventHandler;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="loginButton"></button>
      <a id="registerLink" href=""></a>
    `;

    mockLoginButtonEventHandler = jest.fn();

    loginButton = document.getElementById('loginButton');
    registerLink = document.getElementById('registerLink');

    loginButton.addEventListener('click', mockLoginButtonEventHandler);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when regSourceMethod is passed', () => {
    beforeEach(() => {
      openLoginSidebar('test');
    });

    it('should call login button event handler', () => {
      expect(mockLoginButtonEventHandler).toHaveBeenCalled();
    });

    it('should set `regSourceMethod` parameter in register href', () => {
      expect(registerLink.getAttribute('href')).toBe(
        '/register?regSourceMethod=test',
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
