import PostCodePatterns from '../../../data/PostCodePatterns';

function getFieldTerm(country) {
  return country === 'United States of America' ? 'Zipcode' : 'Postcode';
}

function postcodeSupported(country) {
  const pattern = PostCodePatterns[country.value];
  return pattern !== '^$';
}

function hidePostcodeField(postcode) {
  postcode.parentElement.style.display = 'none';
  postcode.value = '';
}

function resetPostcodeField(postcode) {
  postcode.value = '';

  postcode.classList.remove('is-touched');
  postcode.classList.add('is-untouched');

  postcode.classList.remove('is-dirty');
  postcode.classList.add('is-pristine');
}

function showPostcodeField(postcode) {
  postcode.parentElement.style.display = 'block';
}

function resetLabels(registrationForm, country) {
  const fieldTerm = getFieldTerm(country.value);
  registrationForm.querySelector(
    '#reg-form-postcode ~ label',
  ).innerHTML = fieldTerm;
  registrationForm
    .querySelectorAll('#reg-form-postcode ~ .error-text')
    .forEach((el) => {
      el.innerHTML = `Please enter a valid ${fieldTerm.toLowerCase()}`;
    });
}

export default () => {
  const registrationForm = document.getElementById('reg-form');

  if (registrationForm) {
    const country = document.getElementById('reg-form-country');
    const postcode = document.getElementById('reg-form-postcode');

    const optOutPolicyToggle = registrationForm.querySelector(
      '.opt-out-policy-label',
    );
    const optOutPolicyContainer = registrationForm.querySelector(
      '.opt-out-policy-container',
    );

    optOutPolicyToggle.addEventListener('click', () => {
      optOutPolicyContainer.classList.toggle('open');
    });

    if (country && postcode) {
      hidePostcodeField(postcode);

      country.addEventListener('change', () => {
        if (postcodeSupported(country)) {
          showPostcodeField(postcode);
          resetPostcodeField(postcode);
          resetLabels(registrationForm, country);
        } else {
          hidePostcodeField(postcode);
        }
      });
    }
  }
};
