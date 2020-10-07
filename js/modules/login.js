export default () => {
  const form = document.querySelector('.js-login-form');
  const username = document.querySelector('#login-form-email');
  const password = document.querySelector('#login-form-password');
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkUsername = () => re.test(String(username.value).toLowerCase());
  const checkPassword = () => password.value.length > 5;
  const checkValidInputs = () => {
    form.classList[checkUsername() && checkPassword() ? 'remove' : 'add'](
      'not-completed',
    );
  };

  username.addEventListener('input', checkValidInputs);
  password.addEventListener('input', checkValidInputs);

  checkValidInputs();
};
