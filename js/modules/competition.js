/* globals NGX */
import { getCookie } from './cookie';

const initCompetition = () => {
  const competition = document.querySelector(
    'iframe[src*="https://xd.wayin.com"]',
  );
  if (!competition) return;

  let messageContainer = document.createElement('div');
  competition.parentElement.appendChild(messageContainer);

  if (!getCookie('loggedIn')) {
    competition.style.display = 'none';
    messageContainer.innerHTML =
      '<h4>Please <a class="competitions-login">log in</a> or <a class="competitions-register" href="/register?regSourceMethod=Competitions">register</a> to enter.</h4>';

    competition.parentElement
      .querySelector('.competitions-login')
      .addEventListener('click', () => {
        document.querySelector('header button[on="tap:sidebar.open"]').click();
      });

    competition.parentElement
      .querySelector('.competitions-register')
      .addEventListener('click', () => {
        localStorage.setItem('returnUrl', window.location.href);
      });
  } else {
    messageContainer.innerHTML = '<h4>Loading...</h4>';

    competition.style.display = 'none';

    competition.setAttribute('width', 500);
    competition.setAttribute('height', 500);
    competition.setAttribute('frameborder', 0);

    competition.onload = function () {
      let loginRequired = false;
      setTimeout(() => {
        // delay this to avoid flickering on the logged in version
        if (!loginRequired) {
          competition.style.display = 'block';
          messageContainer.style.display = 'none';
        }
      }, 2000);

      const queryString = `__amp_source_origin=${window.location.origin}`;
      fetch(`/internal-api/competition-data?${queryString}`, {})
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Unable to fetch comments');
        })
        // NGX doesn't accept arrow => functions
        .then(function ({ providerUID, firstName, lastName, email, provider }) {
          NGX.Embed.getUser(function (user) {
            user.id = providerUID;
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.network = provider;
            NGX.Embed.loginUser(
              user,
              function () {
                competition.style.display = 'block';
                messageContainer.style.display = 'none';
              },
              function () {
                throw new Error('Failed to logged in the user.');
              },
            );
          });
        })
        .catch((ex) => {
          console.error(ex);
        });
    };
  }
};

export default initCompetition;
