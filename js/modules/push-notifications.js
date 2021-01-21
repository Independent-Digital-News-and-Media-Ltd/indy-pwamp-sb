import digitalData from './digitalData';
import {
  dispatchPushNotificationShown,
  dispatchPushNotificationOptIn,
  dispatchPushNotificationDismiss,
} from './customEvents';

export default () =>
  new Promise((resolve) => {
    const gigyaUserId = digitalData ? digitalData.gigya_uid : undefined;
    const pathname = window.location.pathname;
    if (
      pathname.startsWith('/news/world/americas/us-election-2020') ||
      pathname.startsWith('/news/world/americas/us-politics')
    ) {
      // eslint-disable-next-line no-undef
      UA.then((sdk) => {
        sdk.plugins
          .load(
            'html-prompt',
            'https://aswpsdkus.com/notify/v1/ua-html-prompt.min.js',
            {
              // appearDelay: 5000,
              appearDelay: 20000,
              // askAgainDelay: 0,
              askAgainDelay: 259200000,
              i18n: {
                en: {
                  title: 'Allow notifications',
                  message:
                    'Get the latest breaking news alerts from <strong>The Independent</strong>.',
                  accept: 'Yes, notify me',
                  deny: 'Not now',
                },
              },
              stylesheet:
                'https://static.independent.co.uk/push-notifications/push-notifications.css',
            },
          )
          .then((plugin) => {
            plugin.prompt();

            plugin.addEventListener('accept', () =>
              dispatchPushNotificationOptIn(),
            );

            plugin.addEventListener('deny', () =>
              dispatchPushNotificationDismiss(),
            );

            plugin.addEventListener('show', () =>
              dispatchPushNotificationShown(),
            );

            if (sdk.channel) {
              sdk.channel.namedUser.set(gigyaUserId);
            }

            resolve();
          });
      });
    } else {
      resolve();
    }
  });
