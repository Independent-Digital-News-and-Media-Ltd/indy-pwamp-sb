const returnBtn = document.querySelector('.return-btn');
const regSourceMethod = localStorage.getItem('regSourceMethod');

if (regSourceMethod === 'Commenting') {
  let returnUrl = localStorage.getItem('returnUrl');
  setTimeout(function () {
    window.location.replace(returnUrl);
  }, 3000);
}

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
