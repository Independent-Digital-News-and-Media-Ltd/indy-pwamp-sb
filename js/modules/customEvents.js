import { dispatch, createCustomEvent } from '../utils/tracking';

const { article_title, article_id, article_author } = window.digitalData || {};

/**
 * @file
 * All custom events here are used for GTM.
 */

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

export const dispatchCommentSubmitted = (data) =>
  dispatch(
    createCustomEvent('comment', {
      detail: {
        article_title,
        article_id,
        article_author,
        ...data,
      },
    }),
  );

export const dispatchShowCommentsClick = (data) =>
  dispatch(
    createCustomEvent('show_comments_click', {
      detail: {
        article_title,
        article_id,
        article_author,
        ...data,
      },
    }),
  );

export const dispatchFlagCommentClick = (data) =>
  dispatch(
    createCustomEvent('flag_comment_click', {
      detail: {
        article_title,
        article_id,
        article_author,
        ...data,
      },
    }),
  );

export const dispatchVoteCommentClick = (data) =>
  dispatch(
    createCustomEvent('vote_comment_click', {
      detail: {
        article_title,
        article_id,
        article_author,
        ...data,
      },
    }),
  );

export const dispatchLoadMoreComments = (data) =>
  dispatch(
    createCustomEvent('load_more_comments', {
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

export const dispatchLiveBlogBulletedListClick = (data) =>
  dispatch(
    createCustomEvent('liveblog_bulleted_list_click', {
      detail: { ...data },
    }),
  );

export const dispatchArticleBulletedListClick = (data) =>
  dispatch(
    createCustomEvent('article_bulleted_list_click', {
      detail: { ...data },
    }),
  );

export const dispatchBlogPostArticleLinkClick = (data) =>
  dispatch(
    createCustomEvent('blog_post_article_link_click', {
      detail: { ...data },
    }),
  );
