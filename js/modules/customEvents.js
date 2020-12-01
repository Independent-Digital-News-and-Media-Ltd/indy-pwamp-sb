const { article_title, article_id, article_author } = window.digitalData || {};

/**
 * @file
 * All custom events here are used for GTM.
 */

const prettyLog = (name, eventData) => {
  const detail = eventData?.detail || {};
  const dataJson = JSON.stringify(detail, null, 2);
  const title = `CustomEvent: ${name}`;

  const dataWidth = dataJson
    .split('\n')
    .reduce((acc, value) => (value.length >= acc ? value.length : acc), 0);
  const titleWidth = title.length;
  const width = Math.max(titleWidth, dataWidth);
  const titleLine = `  ${title.padEnd(width)}  `;
  const dataLines = dataJson.split('\n').map((x) => `  ${x.padEnd(width)}  `);

  const dataLogLines =
    dataLines.length > 1
      ? `%c${dataLines.slice(0, 1)}\n` +
        `%c${dataLines.slice(1, -1).join('\n')}\n` +
        `%c${dataLines.slice(-1)}\n`
      : `%c${dataLines[0]}\n`;
  const dataLogStyless =
    dataLines.length > 1
      ? [
          'font-family:monospace; background: #333; color: #eee; padding-top: 5px;',
          'font-family:monospace; background: #333; color: #eee;',
          'font-family:monospace; background: #333; color: #eee; padding-bottom: 10px; border-radius: 0 0 6px 6px',
        ]
      : [
          'font-family:monospace; background: #333; color: #eee; padding-top: 5px; padding-bottom: 10px; border-radius: 0 0 6px 6px',
        ];
  // eslint-disable-next-line no-console
  console.log(
    `%c${titleLine}\n` + dataLogLines,
    'font-family:monospace; background: #333; color: #eee; border-bottom: 1px solid #666; padding: 5px 0; border-radius: 6px 6px 0 0',
    ...dataLogStyless,
  );
};

const createCustomEvent = (name, eventData) => {
  prettyLog(name, eventData);
  return new CustomEvent(name, eventData);
};

const dispatch = (event) => document.body.dispatchEvent(event);

export const dispatchArticleComplete = () =>
  dispatch(
    createCustomEvent('article_complete', {
      detail: {
        article_title,
        article_id,
        article_author,
      },
    }),
  );

export const dispatchArticleBookmark = () =>
  dispatch(
    createCustomEvent('article_bookmark', {
      detail: {
        article_title,
        article_id,
        article_author,
      },
    }),
  );

export const dispatchSubscriptionButtonClick = (data) =>
  dispatch(
    createCustomEvent('subscription_button_click', { detail: { ...data } }),
  );

export const dispatchDonation = (data = {}) =>
  dispatch(createCustomEvent('donation', { detail: { ...data } }));

export const dispatchDonationArticleBottom = (data = {}) =>
  dispatch(
    createCustomEvent('donation_article_bottom', { detail: { ...data } }),
  );

export const dispatchGalleryView = () =>
  dispatch(
    createCustomEvent('gallery_view', {
      detail: {
        article_title,
        article_id,
        article_author,
      },
    }),
  );

export const dispatchAutoGalleryView = () =>
  dispatch(
    createCustomEvent('auto_gallery_view', {
      detail: {
        article_title,
        article_id,
        article_author,
      },
    }),
  );

export const dispatchRegistrationSuccess = (data) =>
  dispatch(createCustomEvent('registration_success', { detail: { ...data } }));

export const dispatchRegistrationFailed = (data) =>
  dispatch(createCustomEvent('registration_failed', { detail: { ...data } }));

export const dispatchLoginSuccess = (data) =>
  dispatch(createCustomEvent('login_success', { detail: { ...data } }));

export const dispatchArticleShare = (data = {}) =>
  dispatch(
    createCustomEvent('article_share', {
      detail: {
        article_title,
        article_id,
        article_author,
        ...data,
      },
    }),
  );

export const dispatchSearch = (data) =>
  dispatch(createCustomEvent('search', { detail: { ...data } }));

export const dispatchMegaMenuLinkClick = (data) =>
  dispatch(createCustomEvent('mega_menu_link_click', { detail: { ...data } }));

export const dispatchMainNavLinkClick = (data) =>
  dispatch(createCustomEvent('main_nav_link_click', { detail: { ...data } }));

export const dispatchMostPopularLinkClick = (data) =>
  dispatch(
    createCustomEvent('most_popular_link_click', { detail: { ...data } }),
  );

export const dispatchPopularVideosLinkClick = (data) =>
  dispatch(
    createCustomEvent('popular_videos_link_click', { detail: { ...data } }),
  );

export const dispatchSponsoredFeaturesLinkClick = (data) =>
  dispatch(
    createCustomEvent('sponsored_features_link_click', { detail: { ...data } }),
  );

export const dispatchReadMoreLinkClick = (data) =>
  dispatch(createCustomEvent('read_more_link_click', { detail: { ...data } }));

export const dispatchIndy100TrendingLinkClick = (data) =>
  dispatch(
    createCustomEvent('indy100_trending_link_click', { detail: { ...data } }),
  );

export const dispatchTaboolaFeedLinkClick = (data) =>
  dispatch(
    createCustomEvent('taboola_feed_link_click', { detail: { ...data } }),
  );

export const dispatchRelatedArticlesLinkClick = (data) =>
  dispatch(
    createCustomEvent('related_articles_link_click', { detail: { ...data } }),
  );

export const dispatchWatchMoreArticlesLinkClick = (data) =>
  dispatch(
    createCustomEvent('watch_more_articles_link_click', {
      detail: { ...data },
    }),
  );

export const dispatchPaymentFormLoaded = (data) =>
  dispatch(createCustomEvent('payment_form_loaded', { detail: { ...data } }));

export const dispatchPaymentDetailsSuccess = (data) =>
  dispatch(
    createCustomEvent('payment_details_success', { detail: { ...data } }),
  );

export const dispatchPaymentDetailsFailed = (data) =>
  dispatch(
    createCustomEvent('payment_details_failed', { detail: { ...data } }),
  );

export const dispatchCommentSubmitted = (data, isPremium) =>
  dispatch(
    createCustomEvent(isPremium ? 'premium_comment' : 'comment', {
      detail: {
        article_title,
        article_id,
        article_author,
        ...data,
      },
    }),
  );

export const dispatchIpTabClick = (data) =>
  dispatch(createCustomEvent('ip_tab_click', { detail: { ...data } }));

export const dispatchIpEventClick = (data) =>
  dispatch(createCustomEvent('ip_event_click', { detail: { ...data } }));

export const dispatchIpEBookClick = (data) =>
  dispatch(createCustomEvent('ip_ebook_click', { detail: { ...data } }));

export const dispatchIpDownloadClick = (data) =>
  dispatch(createCustomEvent('ip_download_click', { detail: { ...data } }));

export const dispatchCompletePurchase = (data) =>
  dispatch(createCustomEvent('complete_purchase', { detail: { ...data } }));

export const dispatchPushNotificationShown = (data) =>
  dispatch(
    createCustomEvent('push_notification_shown', {
      detail: { ...data },
    }),
  );

export const dispatchPushNotificationOptIn = (data) =>
  dispatch(
    createCustomEvent('push_notification_optin', {
      detail: { ...data },
    }),
  );

export const dispatchPushNotificationDismiss = (data) =>
  dispatch(
    createCustomEvent('push_notification_dismiss', {
      detail: { ...data },
    }),
  );
