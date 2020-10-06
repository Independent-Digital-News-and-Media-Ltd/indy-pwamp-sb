import { getCookie } from './cookie';

const initNotification = () => {
  const notification = document.querySelector('.bookmark-notification');
  if (!notification) return;

  const closeNotification = notification.querySelector('.close-notification');
  closeNotification.addEventListener('click', () => {
    notification.classList.remove('show-notification');
  });

  const ignoreCheckbox = notification.querySelector('input');
  ignoreCheckbox.addEventListener('click', () => {
    localStorage.setItem('ignore-bookmark', 'true');
  });
};

const initLightbox = () => {
  const loginBtns = [...document.querySelectorAll('.show-login')];
  loginBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('#bookmark-lightbox .close').click();
      document
        .querySelector('button[on="tap:learn-more-lightbox.close"]')
        .click();
      setTimeout(() => {
        document.querySelector('button[on="tap:sidebar.open"]').click();
      }, 400);
    });
  });
};

const showBookmarkNotification = () => {
  const notification = document.querySelector('.bookmark-notification');
  const ignoreNotification = localStorage.getItem('ignore-bookmark');
  if (!notification || ignoreNotification) return;

  notification.classList.add('show-notification');
  setTimeout(() => {
    notification.classList.remove('show-notification');
  }, 3000);
};

const addBookmarkLocalStorage = (articleId) => {
  const bookmarks = JSON.parse(localStorage.getItem('premiumBookmarks')) || [];
  bookmarks.push(articleId);
  localStorage.setItem('premiumBookmarks', JSON.stringify(bookmarks));
};

const removeBookmarkLocalStorage = (articleId) => {
  let bookmarks = JSON.parse(localStorage.getItem('premiumBookmarks')) || [];

  bookmarks = bookmarks.filter((a) => a !== articleId);
  localStorage.setItem('premiumBookmarks', JSON.stringify(bookmarks));
};

const submitBookmark = async (articleId, button) => {
  if (button.classList.contains('submitting')) return;
  button.classList.add('submitting');
  const data = { articleId };
  const queryString = `__amp_source_origin=${window.location.origin}`;
  fetch(`/internal-api/bookmarks?${queryString}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((response) => {
      if (response.saved) {
        [...document.querySelectorAll('.bookmark-button')].forEach((btn) =>
          btn.classList.add('saved'),
        );
        addBookmarkLocalStorage(articleId);
        showBookmarkNotification();
      } else {
        [...document.querySelectorAll('.bookmark-button')].forEach((btn) =>
          btn.classList.remove('saved'),
        );
        removeBookmarkLocalStorage(articleId);
      }
      button.classList.remove('submitting');
    })
    .catch((error) => {
      button.classList.remove('submitting');
      console.error('Fetch failed: ', error.message);
    });
};

const checkSavedBookmark = (button, articleId) => {
  const bookmarks = JSON.parse(localStorage.getItem('premiumBookmarks')) || [];

  if (bookmarks.indexOf(articleId) > -1) {
    button.classList.add('saved');
  } else {
    button.classList.remove('saved');
  }
};

const initBookmark = async () => {
  const bookmarkBtns = [...document.querySelectorAll('.bookmark-button')];
  if (bookmarkBtns.length === 0) return;

  bookmarkBtns.forEach((btn) => {
    const articleId = btn.dataset.articleId;
    if (getCookie('loggedIn')) {
      checkSavedBookmark(btn, articleId);
    }

    btn.addEventListener('click', () => {
      submitBookmark(articleId, btn);
    });
  });
  initLightbox();
  initNotification();
};

export default initBookmark;
