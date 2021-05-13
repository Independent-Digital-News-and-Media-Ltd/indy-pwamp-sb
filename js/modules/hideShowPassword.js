const iconHide = 'url(/img/icons/password-hide.svg)';

const iconShow = 'url(/img/icons/password-show.svg)';

export default () => {
  const passwordEls = document.querySelectorAll('.js-hideshowpassword');
  [...passwordEls].forEach((input) => {
    // Why a hyperlink and not a button? Because buttons seem to trigger
    // JavaScript events elsewhere in the code, and we don't want that here.
    const button = document.createElement('a');
    const styles = {
      background: iconShow,
      cursor: 'pointer',
      height: '24px',
      position: 'absolute',
      display: 'inline-block',
      right: '13px',
      top: '15px',
      width: '24px',
    };

    Object.assign(button.style, styles);

    input.parentElement.append(button);

    button.addEventListener('click', () => {
      if (input.getAttribute('type') === 'password') {
        input.setAttribute('type', 'input');
        button.style.background = iconHide;
      } else {
        input.setAttribute('type', 'password');
        button.style.background = iconShow;
      }
    });
  });
};
