(function () {
  const toggle = document.querySelectorAll('.quiz-toggle-btn');
  toggle.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      btn.parentNode.classList.toggle('show');
    });
  });
})();
