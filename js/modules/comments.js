import { format } from 'timeago.js';
import { getCookie } from './cookie';
import { dispatchCommentSubmitted } from './customEvents';

const initComments = () => {
  const commentsWrapper = document.querySelector('#comments');
  if (!commentsWrapper) return;

  const loggedIn = getCookie('loggedIn');
  const subscriber = getCookie('subscriber');

  if (localStorage.getItem('commentLogin')) {
    localStorage.removeItem('commentLogin');
    location.href = '#comments';
  }

  // show/hide comment form
  const openFormBtns = commentsWrapper.querySelectorAll('.open-comment-form');
  openFormBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.logged-in').classList.add('open');
      btn.closest('.logged-in').querySelector('textarea[name=comment]').focus();
    });
  });

  const closeFormBtns = commentsWrapper.querySelectorAll('.close-comment-form');
  closeFormBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.logged-in').classList.remove('open');
    });
  });

  // show/hide community guidelines
  const showGuidelines = commentsWrapper.querySelectorAll('.guideline-heading');
  showGuidelines.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('guideline-open');
    });
  });

  // set comment list order
  const orderComments = commentsWrapper.querySelectorAll('.comment-order li');
  orderComments.forEach((activeBtn) => {
    activeBtn.addEventListener('click', () => {
      orderComments.forEach((btn) => {
        if (btn.dataset.order === activeBtn.dataset.order) {
          const list = btn.closest('.comment-list');
          list.dataset.order = activeBtn.dataset.order;
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      refreshComments();
    });
  });

  // show all comments
  const allCommentBtns = commentsWrapper.querySelectorAll('.show-all-btn');
  allCommentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const list = btn.closest('.comment-list');
      list.dataset.all = true;
      btn.disabled = true;
      refreshComments();
    });
  });

  // expand comments - read more
  const readMoreBtns = commentsWrapper.querySelectorAll('.read-more-btn');
  readMoreBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      commentsWrapper.classList.add('expanded');
    });
  });

  // set commenting name
  const setNameSubmitBtn = commentsWrapper.querySelectorAll(
    '.create-username .form-submit',
  );
  setNameSubmitBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = btn.closest('form');
      submitSetNameForm(form);
    });
  });

  // post new comment
  const formSubmitBtns = commentsWrapper.querySelectorAll(
    '.post-new-comment .form-submit',
  );
  formSubmitBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = btn.closest('form');
      postComment(form);
    });
  });

  // refresh comments
  const refreshComments = () => {
    fetchComments();
  };

  const showReadMoreBtns = () => {
    if (commentsWrapper.classList.contains('expanded')) return;
    const lists = commentsWrapper.querySelectorAll('.comments-list');
    lists.forEach((list) => {
      const commentListWrapper = list.querySelector('.comment-list-wrapper');
      if (commentListWrapper.clientHeight < 300) {
        list.querySelector('.read-more-btn').classList.add('hidden');
      } else {
        list.querySelector('.read-more-btn').classList.remove('hidden');
      }
    });
  };

  // toggle comment list stream
  const commentTabToggle = commentsWrapper.querySelectorAll(
    '.comment-tab-selector',
  );
  commentTabToggle.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === 'premium') {
        commentsWrapper.classList.add('premium-active');
        commentsWrapper.classList.remove('open-active');
      } else {
        commentsWrapper.classList.add('open-active');
        commentsWrapper.classList.remove('premium-active');
      }
      showReadMoreBtns();
    });
  });

  // set comment form placeholder
  const setNicknamePlaceholders = () => {
    if (getCookie('nickname')) {
      const greeting = `Hi ${decodeURIComponent(
        getCookie('nickname'),
      )}, join the discussion...`;
      const commentFields = commentsWrapper.querySelectorAll(
        'textarea[name="comment"]',
      );
      commentFields.forEach((el) => (el.placeholder = greeting));

      const loggedInGreeting = commentsWrapper.querySelectorAll(
        '.open-comment-form > .greeting',
      );
      loggedInGreeting.forEach((el) => (el.innerHTML = greeting));
    }
  };

  // update comment stream count in tabs and total count in article meta
  const updateCommentTabCount = (arr, list) => {
    const tab = list.dataset.tab;
    let streamTotalCount = arr.length;

    arr.forEach((comment) => {
      streamTotalCount += comment.replies.length;
      comment.replies.forEach((reply) => {
        streamTotalCount += reply.replies.length;
      });
    });

    const tabSelectorCount = commentsWrapper.querySelector(
      `.comment-tab-selector[data-tab=${tab}] .count`,
    );
    tabSelectorCount.innerText = streamTotalCount;

    commentsWrapper.querySelector(
      `.comment-tab-selector[data-tab=${tab}] .plural`,
    ).innerText = streamTotalCount === 1 ? 'comment' : 'comments';
  };

  const updateTotalCommentCount = () => {
    let totalCount = 0;
    const tabCounters = commentsWrapper.querySelectorAll(
      '.comment-tab-selector[data-tab] .count',
    );
    tabCounters.forEach((tab) => (totalCount += parseInt(tab.innerText)));
    const totalCounters = document.querySelectorAll('.comment-count');
    totalCounters.forEach((counter) => {
      counter.querySelector('.count').innerText = totalCount;
      counter.querySelector('.plural').innerText =
        counter.innerText === '1' ? 'comment' : 'comments';
      if (totalCount >= 10) {
        counter.classList.remove('hide-count-amount');
      }
    });
  };

  // empty comment list
  const clearComments = async (commentList) => {
    while (commentList.firstChild) {
      commentList.removeChild(commentList.firstChild);
    }
    Promise.resolve('cleared comments');
  };

  const postData = async (url, data, isForm = false) => {
    let body;
    const headers = {};
    if (isForm) {
      body = new FormData(data);
    } else {
      body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(url, {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers,
      body,
    });
    return response.json();
  };

  const postComment = async (form) => {
    const submitBtn = form.querySelector('.form-submit');
    if (!form.checkValidity() || submitBtn.disabled) return;
    submitBtn.disabled = true;
    const isPremium =
      form
        .querySelector('input[name=streamID]')
        .value.split('_')
        .slice(-1)[0] === 'p';

    postData(
      `/internal-api/comments-post/submit?__amp_source_origin=${window.location.origin}`,
      form,
      true,
    )
      .then((response) => {
        if (response.statusCode !== 200) {
          throw new Error(response.message);
        }
        form.querySelector('textarea').value = '';
        submitBtn.disabled = false;
        refreshComments();
        dispatchCommentSubmitted({}, isPremium);
      })
      .catch((error) => {
        console.error('Failed to post comment: ', error.message);
        form.querySelector('.error-message').innerText = error.message;
        form
          .querySelector('textarea')
          .addEventListener(
            'focus',
            () => (form.querySelector('.error-message').innerText = ''),
          );
        submitBtn.disabled = false;
      });
  };

  const submitSetNameForm = (form) => {
    const responseText = form.querySelector('.form-response');
    const submitBtn = form.querySelector('.form-submit');
    if (!form.checkValidity()) {
      responseText.innerText = 'Only letters and numbers accepted';
      return;
    }
    if (submitBtn.disabled) return;
    submitBtn.disabled = true;

    postData(
      `/internal-api/comments-nickname/submit?__amp_source_origin=${window.location.origin}`,
      form,
      true,
    )
      .then((response) => {
        submitBtn.disabled = false;
        responseText.innerText = response.message;
        if (response.message === 'Nickname updated successfully.') {
          commentsWrapper
            .querySelectorAll('[amp-access="NOT nickname"]')
            .forEach(
              (accessNotNickname) => (accessNotNickname.style.display = 'none'),
            );
          commentsWrapper
            .querySelectorAll('[amp-access="nickname"]')
            .forEach(
              (accessNickname) => (accessNickname.style.display = 'block'),
            );
        }
        setNicknamePlaceholders();
      })
      .catch((error) => {
        submitBtn.disabled = false;
        console.error('Fetch failed: ', error.message);
      });
  };

  const submitLightboxForm = (target, form) => {
    const responseMessage = form.querySelector('.response-message');
    form.querySelector('.form-buttons').classList.add('hide');
    postData(
      `/internal-api/comments-${target}/submit?__amp_source_origin=${window.location.origin}`,
      form,
      true,
    )
      .then((response) => {
        responseMessage.innerText = response.message;
        form.querySelector('.body-text').classList.add('hide');
        if (target === 'flag') {
          const flags =
            JSON.parse(localStorage.getItem('flaggedComments')) || [];
          flags.push(response.commentID);
          localStorage.setItem('flaggedComments', JSON.stringify(flags));
        }
        refreshComments();
      })
      .catch(() => {
        form.querySelector('.form-buttons').classList.remove('hide');
        responseMessage.innerText = `Failed to ${target} comment.`;
      });
  };

  const showLightBox = (target, comment) => {
    const lightBox = commentsWrapper.querySelector(`.comment-${target}`);
    const commentIDInput = lightBox.querySelector('input[name="commentID"]');
    const streamIDInput = lightBox.querySelector('input[name="streamID"]');
    commentIDInput.value = comment.ID;
    streamIDInput.value = comment.streamID;
    lightBox.classList.remove('hide');
  };

  const initLightbox = (target) => {
    const lightBox = commentsWrapper.querySelector(`.comment-${target}`);
    const form = lightBox.querySelector('form');
    const closeLightBoxBtns = lightBox.querySelectorAll('.close, .cancel-btn');
    const submitBtn = lightBox.querySelector('.form-submit');
    const commentIDInput = lightBox.querySelector('input[name="commentID"]');
    const streamIDInput = lightBox.querySelector('input[name="streamID"]');

    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submitLightboxForm(target, form);
    });

    closeLightBoxBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        lightBox.classList.add('hide');
        commentIDInput.value = '';
        streamIDInput.value = '';
        form.querySelector('.response-message').innerText = '';
        form.querySelector('.form-buttons').classList.remove('hide');
        form.querySelector('.body-text').classList.remove('hide');
      });
    });
  };

  const markFlaggedComments = () => {
    const flagged = JSON.parse(localStorage.getItem('flaggedComments')) || [];
    flagged.forEach((id) => {
      const flagBtn = commentsWrapper.querySelector(
        `[data-comment-id="${id}"] .comment-vote-flag`,
      );
      if (flagBtn) {
        flagBtn.classList.add('flagged');
        flagBtn.disabled = true;
      }
    });
  };

  const voteComment = async (button, comment) => {
    const intent = button.dataset.vote;
    const commentData = {
      streamID: comment.streamID,
      commentID: comment.ID,
      vote: intent,
    };
    const url = `/internal-api/comments-vote/submit?__amp_source_origin=${window.location.origin}`;
    postData(url, commentData)
      .then(() => {
        const voteCount = button.querySelector('span:last-of-type');
        if (button.dataset.vote === 'none') {
          button.dataset.vote = button.dataset.defaultVote;
          voteCount.innerText = parseInt(voteCount.innerText) - 1;
        } else {
          voteCount.innerText = parseInt(voteCount.innerText) + 1;
          button.dataset.vote = 'none';
        }
      })
      .catch((error) => {
        console.error('Fetch failed: ', error.message);
      });
  };

  const setCommentVotes = (button, comment) => {
    const countContainer = button.querySelector('span:last-of-type');
    const count =
      button.dataset.defaultVote === 'pos'
        ? comment.posVotes
        : comment.negVotes;
    countContainer.innerText = count || 0;
  };

  const addReplyFormToCommentCard = (parentCommentCard) => {
    if (parentCommentCard.querySelector('form')) return;

    const replyTemplate = parentCommentCard
      .closest('.comment-list')
      .querySelector('.comment-reply-template')
      .cloneNode(true);
    const commentActions = parentCommentCard.querySelector('.comment-actions');
    const parentID = replyTemplate.querySelector('input[name="parentID"]');
    const cancelBtn = replyTemplate.querySelector('.cancel-btn');
    const submitBtn = replyTemplate.querySelector('.reply .form-submit');
    const setNameSubmitBtn = replyTemplate.querySelector(
      '.create-nickname .form-submit',
    );
    const form = replyTemplate.querySelector('form.reply');
    const setNameForm = replyTemplate.querySelector('form.create-nickname');

    parentID.value = parentCommentCard.dataset.commentId;
    commentActions.classList.add('hide');
    replyTemplate.classList.remove('comment-template');

    cancelBtn.addEventListener('click', () => {
      parentCommentCard
        .querySelector('.comment-reply-form')
        .removeChild(replyTemplate);
      commentActions.classList.remove('hide');
    });
    submitBtn.addEventListener('click', () => postComment(form));
    setNameSubmitBtn.addEventListener('click', () =>
      submitSetNameForm(setNameForm),
    );

    parentCommentCard
      .querySelector('.comment-reply-form')
      .appendChild(replyTemplate);
  };

  const createCommentCard = (comment, replyLevel = 0) => {
    const commentTemplate = commentsWrapper
      .querySelector('.comment-template')
      .cloneNode(true);
    const username = commentTemplate.querySelector('.comment-username');
    const body = commentTemplate.querySelector('.comment-body');
    const date = commentTemplate.querySelector('.comment-date');
    const replyBtn = commentTemplate.querySelector('.comment-reply');
    const deleteBtn = commentTemplate.querySelector('.comment-delete');
    const voteBtns = commentTemplate.querySelectorAll('.comment-vote');

    const voteFlagBtn = commentTemplate.querySelector('.comment-vote-flag');

    username.innerText = comment.sender.name;
    if (comment.sender.isStaff) {
      username.classList.add('brand');
    }
    date.innerText = format(comment.dateTime, 'en_UK');
    body.innerText = comment.commentText;
    commentTemplate.dataset.commentId = comment.ID;
    commentTemplate.classList.remove('comment-template');

    if (comment.streamID.includes('_p') && !subscriber) {
      replyBtn.classList.add('comment-prompt-premium');
    } else if (!loggedIn) {
      replyBtn.classList.add('comment-prompt');
    } else if (replyLevel > 1) {
      replyBtn.classList.add('hide');
    } else {
      replyBtn.addEventListener('click', () => {
        addReplyFormToCommentCard(commentTemplate);
        commentTemplate
          .querySelector('.comment-reply-template textarea[name=comment]')
          .focus();
      });
    }

    if (
      loggedIn &&
      getCookie('nickname') &&
      getCookie('nickname') === comment.sender.name
    ) {
      deleteBtn.addEventListener('click', () => {
        showLightBox('delete', comment);
      });
    } else {
      deleteBtn.classList.add('hide');
    }

    voteBtns.forEach((btn) => {
      setCommentVotes(btn, comment);
      btn.addEventListener('click', () => {
        if (!loggedIn) {
          document
            .querySelector('header button[on="tap:sidebar.open"]')
            .click();
          return;
        }
        voteComment(btn, comment);
      });
    });

    voteFlagBtn.addEventListener('click', () => {
      showLightBox('flag', comment);
    });

    replyLevel += 1;
    comment.replies.forEach((reply) => {
      const replyCard = createCommentCard(reply, replyLevel);
      commentTemplate.querySelector('.comment-replies').appendChild(replyCard);
    });

    return commentTemplate;
  };

  const populateCommentList = async (arr, list) => {
    const commentsLength = arr.items?.[0]?.comments?.length;

    if (commentsLength > 0) {
      list.querySelector('.empty-message').classList.add('hide');
      if (commentsLength >= 20) {
        list.querySelector('.show-all-btn').classList.add('active');
      }
    } else {
      list.querySelector('.empty-message').classList.remove('hide');
    }

    const commentsArr = arr.items[0].comments;
    const commentList = list.querySelector('.comment-list-wrapper');

    updateCommentTabCount(commentsArr, list);
    updateTotalCommentCount();
    await clearComments(commentList);

    commentsArr.forEach((comment) => {
      const commentCard = createCommentCard(comment);
      commentList.appendChild(commentCard);
    });

    if (commentList.clientHeight < 300) {
      list.querySelector('.read-more-btn').classList.add('hidden');
    } else {
      list.querySelector('.read-more-btn').classList.remove('hidden');
    }
  };

  const fetchComments = () => {
    const commentLists = commentsWrapper.querySelectorAll('.comments-list');
    commentLists.forEach((list) => {
      const articleId = list.dataset.streamId;
      const order = list.dataset.order;
      const limit = list.dataset.all ? '&all' : '';
      const queryString = `__amp_source_origin=${window.location.origin}&sort=${order}${limit}`;
      fetch(`/internal-api/comments-article/${articleId}?${queryString}`, {})
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Unable to fetch comments');
        })
        .then((response) => {
          populateCommentList(response, list);
        })
        .then(() => {
          markFlaggedComments();
        })
        .catch((error) => {
          console.error('Fetch failed: ', error.message);
        });
    });
  };

  setNicknamePlaceholders();
  fetchComments();
  showReadMoreBtns();
  initLightbox('delete');
  initLightbox('flag');
};

export default initComments;
