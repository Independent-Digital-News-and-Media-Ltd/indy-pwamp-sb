const newsletterRedirect = () => {
  const newsletterRegBtn = document.querySelector('.nsc-register-btn');
  if (newsletterRegBtn) {
    newsletterRegBtn.addEventListener('click', () => {
      localStorage.setItem('returnUrl', window.location.href);
    });
  }
};

export default newsletterRedirect;
