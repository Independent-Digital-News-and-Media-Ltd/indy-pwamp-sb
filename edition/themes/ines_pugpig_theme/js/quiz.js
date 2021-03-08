window.onload = function () {
  const showButton = document.getElementById('show-quiz-answers');
  const hideButton = document.getElementById('hide-quiz-answers');
  const chevron = document.getElementById('quiz-chevron-icon');
  const answers = document.getElementById('tide-quiz-answers');
  answers.style.display = 'none';
  if (showButton) {
    showButton.addEventListener('click', function () {
      answers.style.display = 'block';
      showButton.style.display = 'none';
      hideButton.style.display = 'block';
      chevron.style.transform = 'rotate(180deg)';
    });
  }
  if (hideButton) {
    hideButton.addEventListener('click', function () {
      answers.style.display = 'none';
      hideButton.style.display = 'none';
      showButton.style.display = 'block';
      chevron.style.transform = 'rotate(0deg)';
    });
  }
};
