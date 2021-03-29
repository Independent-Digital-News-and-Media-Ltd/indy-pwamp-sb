import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

import { getCookie } from './cookie';
import { openLoginSidebar } from '../loginSidebar';
import {
  dispatchCommentSubmitted,
  dispatchLoadMoreComments,
  dispatchFlagCommentClick,
  dispatchVoteCommentClick,
} from './customEvents';

import { COMMENTING_RSM } from '../../../constants/regSourceMethods';

const heightLimit = 600;

const postData = async (url, data) => {
  const body = new FormData();

  Object.keys(data).forEach((key) => {
    body.append(key, data[key]);
  });

  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    body,
  });

  return response;
};

const reAuthenticateComments = () =>
  window.vf.session
    .logout()
    .then(window.vf.session.login.cookie(getCookie('esi_guid')));

const updateNickname = (nickname, callback) => {
  postData(
    `/internal-api/comments-nickname/submit?__amp_source_origin=${window.location.origin}`,
    { nickname },
  )
    .then((response) => {
      if (response.status === 200) {
        callback({ success: true });
      } else {
        return response.json().then(({ message }) => {
          callback({ success: false, errorMessage: message });
        });
      }
    })
    .catch((error) => {
      callback({ success: false, errorMessage: error.message });
    });
};

const isValidKeyChar = (code) =>
  (code > 64 && code < 91) ||
  (code > 96 && code < 123) ||
  code === 8 ||
  (code >= 48 && code <= 57);

const createNicknameForm = (onSubmit) => {
  const addNickNameArea = document.createElement('div');
  const addNickNameHeading = document.createElement('h2');
  const addNickNameDescription = document.createElement('p');
  const addNickNameForm = document.createElement('div');
  const addNickNameInput = document.createElement('input');
  const addNickNameSubmit = document.createElement('button');

  addNickNameArea.id = 'add-nickname-form';
  addNickNameHeading.innerHTML =
    "We have noticed you don't have a commenting name yet.";
  addNickNameDescription.innerHTML =
    "Your commenting name is what people will see when you make any comments across Independent articles. Please don't use anything rude or anything that could identify you.";
  addNickNameInput.setAttribute('placeholder', 'Commenting name');
  addNickNameInput.setAttribute('pattern', '^[A-Za-z0-9]{3,40}$');
  addNickNameInput.required = true;
  addNickNameSubmit.innerHTML = 'SUBMIT';
  addNickNameSubmit.disabled = true;

  addNickNameArea.appendChild(addNickNameHeading);
  addNickNameArea.appendChild(addNickNameDescription);
  addNickNameArea.appendChild(addNickNameForm);
  addNickNameForm.appendChild(addNickNameInput);
  addNickNameForm.appendChild(addNickNameSubmit);

  addNickNameSubmit.addEventListener('click', (evt) => {
    if (evt.target.disabled) {
      return false;
    }

    onSubmit(addNickNameInput.value.trim());
  });

  // block invalid chars being entered into display name field
  addNickNameInput.addEventListener('keypress', (evt) => {
    if (!isValidKeyChar(evt.key.charCodeAt(0))) {
      evt.preventDefault();
    }
  });

  addNickNameInput.addEventListener('input', (evt) => {
    addNickNameSubmit.disabled = !evt.target.checkValidity();
  });

  return addNickNameArea;
};

const initNicknameForm = () => {
  const postCommentArea = document.querySelector('.vf-post-form');
  const postCommentFormField = postCommentArea.firstElementChild;
  postCommentFormField.style.display = 'none';

  const addNickNameArea = createNicknameForm((nickname) => {
    updateNickname(nickname, ({ success, errorMessage }) => {
      if (!success) {
        alert(errorMessage);
        return;
      }
      postCommentArea.removeChild(addNickNameArea);
      postCommentFormField.style.display = 'block';

      reAuthenticateComments();
    });
  });

  postCommentArea.appendChild(addNickNameArea);
};

const checkNickname = () => {
  window.vf.context.get('user').then((viaforaUser) => {
    // check to see if comments session aligns with website session
    if (getCookie('esi_guid') !== viaforaUser.social_login_id) {
      // if not aligned reauthenticate
      reAuthenticateComments();
    } else if (viaforaUser.name.toLowerCase() === 'anonymous') {
      initNicknameForm();
    }
  });
};

const limitCommentingHeight = () => {
  const wrapperElem = document.getElementById('comments');
  const actualHeight = wrapperElem.offsetHeight;

  if (actualHeight > heightLimit) {
    wrapperElem.classList.add('height-limited');

    const showMoreButton = document.createElement('button');
    showMoreButton.className = 'show-more';
    showMoreButton.innerHTML = 'See more comments';

    wrapperElem.appendChild(showMoreButton);

    const handleClick = () => {
      wrapperElem.removeChild(showMoreButton);
      wrapperElem.classList.remove('height-limited');
      wrapperElem.removeEventListener('click', handleClick);
      dispatchLoadMoreComments();
    };

    wrapperElem.addEventListener('click', handleClick);
  }
};

const addAnalyticsClickHandlers = () => {
  document
    .getElementById('comments')
    .addEventListener('click', ({ target }) => {
      if (
        target.className
          .split(' ')
          .some(
            (classStr) =>
              classStr.startsWith('vf-content-actions__like') ||
              classStr.startsWith('vf-content-actions__dislike'),
          )
      ) {
        dispatchVoteCommentClick({});
      } else if (['Flag', 'Flagged'].includes(target.innerText?.trim())) {
        dispatchFlagCommentClick({});
      } else if (target.closest('.vf-load-more__button')) {
        // I can't find '.vf-load-more__button'. it's not probably working
        dispatchLoadMoreComments();
      }
    });
};

const logoutOfCommentingIfLoggedIn = () => {
  window.vf.context.get('user').then((user) => {
    if (user.id !== 0) {
      window.viafoura.session.logout();
    }
  });
};

const isLoggedIn = () => getCookie('loggedIn');

const changeCTA = () => {
  const commentMessage = document.querySelector('.js-comment-message');
  const commentCount = commentMessage.querySelector('.js-comment-count');
  const plural = commentMessage.querySelector('.js-comment-plural');
  if (!commentCount.textContent) {
    commentMessage.innerHTML = 'Be the first to comment';
  }
  if (commentCount.textContent === '1') {
    plural.innerHTML = 'comment';
  }
};

const initViafora = () => {
  const logoutButton = document.querySelector('a.icon-logout');

  addAnalyticsClickHandlers();

  window.vf.$prepublish((channel, event, ...args) => {
    if (channel === 'commenting' && event === 'loaded') {
      limitCommentingHeight();
      changeCTA();

      if (isLoggedIn()) {
        checkNickname();
      } else {
        logoutOfCommentingIfLoggedIn();
      }
    }

    if (channel === 'comment' && event === 'created') {
      dispatchCommentSubmitted({});
    }

    if (channel === 'authentication' && event === 'required') {
      // add here the handler to trigger your authentication login flow

      openLoginSidebar(COMMENTING_RSM);

      return false;
    }

    return { channel, event, args };
  });

  window.vf.$subscribe('authentication', 'logout', () => {
    logoutButton.click();
  });
};

const initComments = () => {
  const commentsWrapper = document.getElementById('comments');
  if (!commentsWrapper) return;

  jsLoader(['//cdn.viafoura.net/vf-v2.js'], initViafora);
};

export default initComments;
