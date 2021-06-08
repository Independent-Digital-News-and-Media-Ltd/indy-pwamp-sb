export default () => {
  function markFieldAsDirty(field) {
    field.classList.remove('is-pristine');
    field.classList.add('is-dirty');
  }

  function markFieldAsTouched(field) {
    field.classList.remove('is-untouched');
    field.classList.add('is-touched');
  }

  function bindListenersToForm(form) {
    if (form) {
      const textInputs = form.querySelectorAll('input, select');

      textInputs.forEach((textInput) => {
        textInput.addEventListener('change', () => {
          markFieldAsDirty(textInput);
        });

        textInput.addEventListener('blur', () => {
          markFieldAsTouched(textInput);
        });
      });
    }
  }

  bindListenersToForm(document.querySelector('.reg-form'));
  bindListenersToForm(document.querySelector('.login-form'));
};
