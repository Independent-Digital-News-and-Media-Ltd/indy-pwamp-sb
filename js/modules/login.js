import { dispatchLoginSuccess } from './customEvents';

export default () => {
  const loginSubmits = document.querySelectorAll(
    '#login-form .form-submit, #login-page-form .form-submit',
  );
  loginSubmits.forEach((submit) =>
    submit.addEventListener('click', dispatchLoginSuccess),
  );
};
