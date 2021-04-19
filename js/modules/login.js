import { dispatchLoginSuccess } from './customEvents';
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

  document.querySelectorAll('[data-js-open-login-sidebar]').forEach((el) => {
    el.addEventListener('click', () => {
      const regSourceMethod = el.getAttribute('data-reg-source-method') || '';

      openLoginSidebar(regSourceMethod);
    });
  });
};
