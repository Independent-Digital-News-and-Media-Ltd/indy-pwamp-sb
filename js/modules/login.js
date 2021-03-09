import { dispatchLoginSuccess } from './customEvents';
import { OPEN_LOGIN_SIDEBAR_JS } from '../../../constants/javascript';
import { openLoginSidebar } from '../loginSidebar';

export default () => {
  const loginSubmits = document.querySelectorAll(
    '#login-form .form-submit, #login-page-form .form-submit',
  );

  loginSubmits.forEach((submit) =>
    submit.addEventListener('click', dispatchLoginSuccess),
  );

  /*
   *  bind event listener to login buttons to open login sidebar
   */

  document
    .querySelectorAll(`[data-js=${OPEN_LOGIN_SIDEBAR_JS}]`)
    .forEach((el) => {
      el.addEventListener('click', () => {
        const regSourceMethod = el.getAttribute('data-reg-source-method') || '';

        openLoginSidebar(regSourceMethod);
      });
    });
};
