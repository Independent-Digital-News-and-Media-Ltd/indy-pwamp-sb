(function () {
  const toggle = document.querySelectorAll('.scrollTop');
  toggle.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo(0, 0);
    });
  });
  const links = document.querySelectorAll('a');
  links.forEach((element) => {
    element.addEventListener('click', function (event) {
      // preview mode, disable link
      if (
        element.classList.contains('disabled-on-preview') &&
        /edition\/article/.test(location.pathname)
      ) {
        event.preventDefault();
      }
    });
  });
})();
