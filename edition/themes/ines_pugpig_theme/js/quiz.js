window.onload = function () {
  const showButton = document.getElementById('show-quiz-answers');
  const hideButton = document.getElementById('hide-quiz-answers');
  const chevron = document.getElementById('quiz-chevron-icon');
  const wrapper = document.getElementById('quiz-wrapper');
  if (showButton) {
    showButton.addEventListener('click', function () {
      wrapper.classList.toggle('show');
    });
  }
  if (hideButton) {
    hideButton.addEventListener('click', function () {
      wrapper.classList.remove('show');
    });
  }
  if (chevron) {
    chevron.addEventListener('click', function () {
      wrapper.classList.toggle('show');
    });
  }
};
