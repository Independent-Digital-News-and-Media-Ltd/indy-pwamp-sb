function buildRegisterHref(regSourceMethod) {
  if (regSourceMethod) {
    return `/register?regSourceMethod=${regSourceMethod}`;
  } else {
    return '/register';
  }
}

export const openLoginSidebar = (regSourceMethod) => {
  const loginButton = document.getElementById('loginButton');
  const registerLink = document.getElementById('registerLink');

  if (registerLink) {
    registerLink.setAttribute('href', buildRegisterHref(regSourceMethod));
  }

  if (loginButton) {
    loginButton.click();
  }
};
