export const animateIn = (el) => {
  Object.assign(el.style, {
    transition: '0.4s transform linear',
    transform: 'translateY(100%)',
    display: 'block',
  });

  el.offsetHeight;

  el.style.transform = 'translateY(0)';
};

export const animateOut = (el) => {
  el.addEventListener(
    'transitionend',
    () => {
      el.style.display = 'none';
    },
    { once: true },
  );

  Object.assign(el.style, {
    transition: '0.4s transform linear',
    transform: 'translateY(100%)',
  });
};
