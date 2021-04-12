(function () {
  const toggle = document.querySelectorAll('.scrollTop');
  toggle.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo(0, 0);
    });
  });
})();