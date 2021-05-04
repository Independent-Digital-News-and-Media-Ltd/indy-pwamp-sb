import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

const sliderInit = () => {
  if (window.tns) {
    window.tns({
      container: '#journalists-list',
      items: 1,
      slideBy: 1,
      mouseDrag: true,
      responsive: {
        950: {
          items: 3,
        },
      },
    });
    document.querySelector('#journalists-list').style.opacity = 1;
  }
};

jsLoader(
  [
    'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.8.6/min/tiny-slider.js',
  ],
  sliderInit,
);

const studentToggle = document.querySelectorAll('.student-pricing-toggle');
studentToggle.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    document
      .querySelectorAll('.student-pricing-button')
      .forEach((el) => el.classList.toggle('active'));
    document
      .querySelectorAll('.student-pricing-option')
      .forEach((el) => el.classList.toggle('active'));
  });
});

const studentForm = document.querySelector('#student-code-form');
const scrollUp = document.querySelectorAll('.zoom-up');

scrollUp.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    studentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
