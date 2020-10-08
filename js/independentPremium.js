import { getCookie } from './modules/cookie';

const bookmarkWrapper = document.querySelector('section[data-tab="bookmarks"]');
const commentWrapper = document.querySelector('section[data-tab="comments"]');

const createBookmarkItem = (bookmark) => {
  const bookmarkTemplate = bookmarkWrapper
    .querySelector('.bookmark-template')
    .cloneNode(true);
  const links = bookmarkTemplate.querySelectorAll('.link');
  const thumbnail = bookmarkTemplate.querySelector('.poster img');
  const title = bookmarkTemplate.querySelector('.title');
  const lead = bookmarkTemplate.querySelector('.lead');
  const published = bookmarkTemplate.querySelector('.published');
  const authors = bookmarkTemplate.querySelector('.authors');
  const section = bookmarkTemplate.querySelector('.section');
  const remove = bookmarkTemplate.querySelector('.remove');

  links.forEach((link) => (link.href = bookmark.url));
  thumbnail.src = bookmark.image;
  title.innerText = bookmark.title;
  lead.innerHTML = bookmark.lead;
  published.innerText = bookmark.publishDate;
  section.innerText = bookmark.section;
  authors.innerHTML = bookmark.authors;
  remove.dataset.id = bookmark.sourceId;

  bookmarkTemplate.classList.remove('hidden');

  remove.addEventListener('click', () => {
    deleteBookmark(remove);
  });

  return bookmarkTemplate;
};

const insertBookmarks = (arr) => {
  const { bookmarks } = arr;
  const subscriber = getCookie('subscriber') === 'true';

  if (!(bookmarks && bookmarks.length > 0)) {
    if (subscriber) {
      bookmarkWrapper
        .querySelector('.bookmarks-empty')
        .classList.remove('hidden');
    } else {
      bookmarkWrapper
        .querySelector('.bookmarks-require-subscription')
        .classList.remove('hidden');
    }
    return;
  }

  if (!subscriber) {
    bookmarkWrapper
      .querySelector('.bookmarks-expired-subscription')
      .classList.remove('hidden');
    return;
  }

  const bookmarksList = bookmarkWrapper.querySelector('.list');

  bookmarks.forEach((bm) => {
    const bookmarkItem = createBookmarkItem(bm);
    bookmarksList.appendChild(bookmarkItem);
  });
};

const clearList = async (tabWrapper) => {
  const listWrapper = tabWrapper.querySelector('.list');
  while (listWrapper.firstChild) {
    listWrapper.removeChild(listWrapper.firstChild);
  }
};

const setBookmarkLocalStorage = (bookmarks) => {
  const articleIds = bookmarks.map((b) => b.sourceId);
  localStorage.setItem('premiumBookmarks', JSON.stringify(articleIds));
};

const removeBookmarkLocalStorage = (articleId) => {
  let bookmarks = JSON.parse(localStorage.getItem('premiumBookmarks')) || [];
  bookmarks = bookmarks.filter((a) => a !== articleId);
  localStorage.setItem('premiumBookmarks', JSON.stringify(bookmarks));
};

const deleteBookmark = (button) => {
  if (button.disabled) return;
  button.disabled = true;
  const articleId = button.dataset.id;
  const queryString = `__amp_source_origin=${window.location.origin}`;
  fetch(`/internal-api/bookmarks/${articleId}?${queryString}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(() => {
      removeBookmarkLocalStorage(articleId);
      button.closest('.bookmark-template').remove();
    })
    .catch((error) => {
      button.disabled = false;
      console.error('Fetch failed: ', error.message);
    });
};

const fetchBookmarks = () => {
  clearList(bookmarkWrapper);
  bookmarkWrapper.querySelector('.loading').classList.remove('hidden');
  const queryString = `__amp_source_origin=${window.location.origin}`;
  fetch(`/internal-api/bookmarks?${queryString}`, {})
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((response) => {
      bookmarkWrapper.querySelector('.loading').classList.add('hidden');
      insertBookmarks(response);
      setBookmarkLocalStorage(response.bookmarks);
    })
    .catch((error) => {
      console.error('Fetch failed: ', error.message);
    });
};

const commentListToggle = () => {
  const tabs = commentWrapper.querySelectorAll('[data-comment-tab]');
  const tabBtns = commentWrapper.querySelectorAll('button[data-comment-tab]');
  tabBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      tabs.forEach((tab) => {
        if (tab.dataset.commentTab === btn.dataset.commentTab) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }),
  );
};

const deleteComment = (btn, streamID, commentID) => {
  const queryString = `__amp_source_origin=${window.location.origin}`;
  fetch(`/internal-api/comments-delete/submit?${queryString}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ streamID, commentID }),
  })
    .then((response) => {
      if (response.ok) {
        btn.closest('.comment-template').remove();
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .catch((error) => {
      console.error('Fetch failed: ', error.message);
    });
};

const createCommentItem = (comment) => {
  const commentTemplate = commentWrapper
    .querySelector('.comment-template')
    .cloneNode(true);

  const date = commentTemplate.querySelector('.date');
  const deleteBtn = commentTemplate.querySelector('.delete');
  const articleTitle = commentTemplate.querySelector('.title');
  const message = commentTemplate.querySelector('.message');
  const links = commentTemplate.querySelectorAll('.link');
  const ellipsis = commentTemplate.querySelector('.ellipsis');

  const { published, title, path, ID, streamId, commentText } = comment;

  links.forEach((link) => (link.href = path));
  date.innerText = published;
  deleteBtn.dataset.streamId = streamId;
  deleteBtn.dataset.commentId = ID;
  articleTitle.innerText = title;
  message.innerText = commentText;

  commentTemplate.classList.remove('hidden');

  deleteBtn.addEventListener('click', () => {
    deleteComment(deleteBtn, streamId, ID);
  });
  ellipsis.addEventListener('click', () => {
    ellipsis.closest('.options').classList.toggle('active');
  });

  return commentTemplate;
};

const createCommentPage = (list, page, pageNumber) => {
  const stream = list.dataset.commentTab;
  const nextBtns = commentWrapper.querySelector(
    `.next-btns[data-comment-tab=${stream}]`,
  );

  nextBtns.classList.remove('hidden');

  let nextButton = document.createElement('button');
  nextButton.setAttribute('href', `#page${pageNumber}`);
  nextButton.innerHTML = pageNumber;
  if (pageNumber === 1) {
    nextButton.classList.add('current');
  }

  nextButton.addEventListener('click', () => {
    nextBtns.querySelectorAll('button').forEach((btn) => {
      btn.classList.remove('current');
    });
    nextButton.classList.add('current');
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    page.forEach((comment) => {
      const commentItem = createCommentItem(comment);
      list.appendChild(commentItem);
    });
  });
  nextBtns.appendChild(nextButton);
};

const clearCommentsPagination = (list) => {
  const stream = list.dataset.commentTab;
  const nextBtns = commentWrapper.querySelector(
    `.next-btns[data-comment-tab=${stream}]`,
  );
  while (nextBtns.firstChild) {
    nextBtns.removeChild(nextBtns.lastChild);
  }
};

const insertMyComments = (list, response) => {
  clearCommentsPagination(list);
  const comments = response.comments;

  if (!(comments && comments.length > 0)) {
    list.innerHTML =
      '<h4>You have not commented on any of our live articles yet</h4>';
    return;
  }

  const pageSize = 10;
  const sortedComments = [];

  for (let i = 0; i < comments.length; i += pageSize) {
    sortedComments.push(comments.slice(i, i + pageSize));
  }

  sortedComments[0].forEach((comment) => {
    const commentItem = createCommentItem(comment);
    list.appendChild(commentItem);
  });

  if (sortedComments.length > 1) {
    sortedComments.forEach((page, index) => {
      createCommentPage(list, page, index + 1);
    });
  }
};

const fetchMyComments = () => {
  clearList(commentWrapper);
  commentWrapper.querySelector('.loading').classList.remove('hidden');

  const commentLists = commentWrapper.querySelectorAll('.list');

  commentLists.forEach((list) => {
    let queryString = `__amp_source_origin=${window.location.origin}`;
    if (list.classList.contains('premium')) {
      queryString += '&premium=true';
    }
    fetch(`/internal-api/user-comments?${queryString}`, {})
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((response) => {
        commentWrapper.querySelector('.loading').classList.add('hidden');
        insertMyComments(list, response);
      })
      .catch((error) => {
        console.error('Fetch failed: ', error.message);
      });
  });
};

const showHashPage = () => {
  const hash = location.hash.substring(1);
  const menuBtns = document.querySelectorAll('#premium-menu [data-tab]');
  const pages = document.querySelectorAll('.premium-wrapper [data-tab]');
  if (hash === 'bookmarks') {
    fetchBookmarks();
  }
  if (hash === 'comments') {
    fetchMyComments();
  }
  toggleActive(pages, hash);
  toggleActive(menuBtns, hash);
};

const toggleActive = (items, match) => {
  items.forEach((item) => {
    if (match === item.dataset.tab) {
      return item.classList.add('active');
    }
    item.classList.remove('active');
  });
};

showHashPage();
commentListToggle();

window.addEventListener('hashchange', showHashPage, false);
