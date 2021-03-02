import { setCookie } from './modules/cookie';

const feeds = document.querySelectorAll('.feed-list li');
const clear = document.getElementById('clear-setting');

if (clear) {
  clear.addEventListener('click', function () {
    setCookie('feed', '');
    setCookie('publication', '');
  });
}

if (feeds) {
  feeds.forEach((element) => {
    element.addEventListener('click', function (e) {
      setCookie('feed', e.target.getAttribute('data-value'));
      location.href = '/';
    });
  });
}
