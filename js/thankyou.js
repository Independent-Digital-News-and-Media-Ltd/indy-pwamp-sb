import { trackSubscriptionCause } from './modules/taboola';

const returnBtn = document.querySelector('.return-btn');

trackSubscriptionCause();

if (returnBtn) {
  returnBtn.addEventListener('click', () => {
    let returnUrl = localStorage.getItem('returnUrl');
    if (window.opener) {
      window.opener.location.reload();
      window.close();
    } else {
      window.location.href = returnUrl || '/';
    }
    localStorage.removeItem('returnUrl');
  });
}

const refreshParent = document.querySelectorAll('.refresh-parent');
refreshParent.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (window.opener) {
      window.opener.location.reload();
    }
  });
});
