import PostCodePatterns from '../../data/PostCodePatterns';

const profileLinks = document.querySelectorAll('.profile-link');
[].forEach.call(profileLinks, (pl) => {
  if (!pl.dataset) return;
  pl.addEventListener('click', () => {
    [].forEach.call(profileLinks, (p) => p.classList.remove('active'));
    [].forEach.call(
      profileLinks,
      (p) =>
        p.dataset &&
        p.dataset.tab === pl.dataset.tab &&
        p.classList.add('active'),
    );

    const showTab = pl.dataset.tab;
    if (showTab) {
      const tabs = document.querySelectorAll('.profile-wrapper .tab');
      const showTabs = document.querySelectorAll(`.${showTab}`);
      [].forEach.call(tabs, (el) => el.classList.remove('active'));
      [].forEach.call(showTabs, (el) => el.classList.add('active'));
    }

    if (showTab === 'payments' && !window.loadedAccount) {
      let tp = window.tp || [];
      window.loadedAccount = true;
      tp.push([
        'init',
        function () {
          tp.myaccount.show({
            displayMode: 'inline',
            containerSelector: '#my-account',
          });
        },
      ]);
    }
  });
});

const showPassword = document.querySelectorAll('.show-password');
[].forEach.call(showPassword, (el) => {
  el.addEventListener('click', () => {
    const passwordInput = el.parentElement.querySelector('input');
    if (!passwordInput) return;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      el.text = 'Hide';
    } else {
      passwordInput.type = 'password';
      el.text = 'Show';
    }
  });
});

const postcodeCountryValidation = () => {
  const fieldTerm =
    country.value === 'United States of America' ? 'Zipcode' : 'Postcode';
  const pattern = PostCodePatterns[country.value];

  if (pattern === '^$') {
    postcode.parentElement.style.display = 'none';
    postcode.value = '';
    postcode.required = false;
    return;
  }

  postcode.parentElement.style.display = 'block';
  postcode.required = true;
  document.querySelector('#reg-form-postcode ~ label').innerHTML = fieldTerm;
  const errorText = document.querySelectorAll(
    '#reg-form-postcode ~ .error-text',
  );
  [].forEach.call(errorText, (el) => {
    el.innerHTML = `Please enter a valid ${fieldTerm.toLowerCase()}`;
  });
};

const country = document.querySelector('#reg-form-country');
const postcode = document.querySelector('#reg-form-postcode');
if (country && postcode) {
  postcodeCountryValidation();
  country.addEventListener('change', () => {
    postcodeCountryValidation();
  });
}

const mobileProfileLinks = document.querySelectorAll(
  '.profile-wrapper ul .profile-link',
);
[].forEach.call(mobileProfileLinks, (mpl) => {
  mpl.addEventListener('click', () => {
    document.querySelector('.profile-wrapper ul').classList.toggle('open');
  });
});

const mobileBackground = document.querySelector('.mobile-background');
mobileBackground &&
  mobileBackground.addEventListener('click', () => {
    document.querySelector('.profile-wrapper ul').classList.remove('open');
  });

const profileFormSelects = document.querySelectorAll(
  '#profile-form input, #profile-form select',
);
[].forEach.call(profileFormSelects, (input) => {
  if (input.value && input.checkValidity()) {
    input.classList.add('valid');
  }
});
