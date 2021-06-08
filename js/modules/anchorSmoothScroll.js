export default () => {
  document.body.addEventListener('click', (e) => {
    const href = e.target.closest('a').href;

    if (!href) return;

    const id = href.split('#').pop();
    const target = document.getElementById(id);

    if (!target) return;

    // prevent the default quick jump to the target
    e.preventDefault();

    // set hash to window location so history is kept correctly
    history.pushState({}, document.title, href);

    // smooth scroll to the target
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
};
