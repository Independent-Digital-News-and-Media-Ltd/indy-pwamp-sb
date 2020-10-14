import { dispatchLoginSuccess } from './customEvents';

export default () => {
  const loginSubmit = document.querySelector('#login-form .form-submit');
  loginSubmit.addEventListener('click', () => {
    dispatchLoginSuccess();
  });
};
