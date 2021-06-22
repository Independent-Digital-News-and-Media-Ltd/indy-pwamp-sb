import { dispatchCustomEvent } from '../utils/dispatchCustomEvent';

const { article_title, article_id, article_author } = window.digitalData || {};

/**
 * @file
 * All custom events here are used for GTM.
 */

export const dispatchArticleComplete = (data = {}) =>
  dispatchCustomEvent('article_complete', {
    article_title,
    article_id,
    article_author,
    ...data,
  });

export const dispatchArticleBookmark = (data = {}) =>
  dispatchCustomEvent('article_bookmark', {
    article_title,
    article_id,
    article_author,
    ...data,
  });

export const dispatchSubscriptionButtonClick = (data = {}) =>
  dispatchCustomEvent('subscription_button_click', data);

export const dispatchDonation = (data = {}) =>
  dispatchCustomEvent('donation', data);

export const dispatchDonationArticleBottom = (data = {}) =>
  dispatchCustomEvent('donation_article_bottom', data);

export const dispatchGalleryView = (data = {}) =>
  dispatchCustomEvent('gallery_view', {
    article_title,
    article_id,
    article_author,
    ...data,
  });

export const dispatchAutoGalleryView = (data = {}) =>
  dispatchCustomEvent('auto_gallery_view', {
    article_title,
    article_id,
    article_author,
    ...data,
  });

export const dispatchRegistrationSuccess = (data = {}) =>
  dispatchCustomEvent('registration_success', data);

export const dispatchRegistrationFailed = (data = {}) =>
  dispatchCustomEvent('registration_failed', data);

export const dispatchLoginSuccess = (data = {}) =>
  dispatchCustomEvent('login_success', data);

export const dispatchArticleShare = (data = {}) =>
  dispatchCustomEvent('article_share', {
    article_title,
    article_id,
    article_author,
    ...data,
  });

export const dispatchSearch = (data = {}) =>
  dispatchCustomEvent('search', data);

export const dispatchMegaMenuLinkClick = (data = {}) =>
  dispatchCustomEvent('mega_menu_link_click', data);

export const dispatchMainNavLinkClick = (data = {}) =>
  dispatchCustomEvent('main_nav_link_click', data);

export const dispatchMostPopularLinkClick = (data = {}) =>
  dispatchCustomEvent('most_popular_link_click', data);

export const dispatchPopularVideosLinkClick = (data = {}) =>
  dispatchCustomEvent('popular_videos_link_click', data);

export const dispatchSponsoredFeaturesLinkClick = (data = {}) =>
  dispatchCustomEvent('sponsored_features_link_click', data);

export const dispatchReadMoreLinkClick = (data = {}) =>
  dispatchCustomEvent('read_more_link_click', data);

export const dispatchIndy100TrendingLinkClick = (data = {}) =>
  dispatchCustomEvent('indy100_trending_link_click', data);

export const dispatchTaboolaFeedLinkClick = (data = {}) =>
  dispatchCustomEvent('taboola_feed_link_click', data);

export const dispatchRelatedArticlesLinkClick = (data = {}) =>
  dispatchCustomEvent('related_articles_link_click', data);

export const dispatchWatchMoreArticlesLinkClick = (data = {}) =>
  dispatchCustomEvent('watch_more_articles_link_click', data);

export const dispatchPaymentFormLoaded = (data = {}) =>
  dispatchCustomEvent('payment_form_loaded', data);

export const dispatchPaymentDetailsSuccess = (data = {}) =>
  dispatchCustomEvent('payment_details_success', data);

export const dispatchPaymentDetailsFailed = (data = {}) =>
  dispatchCustomEvent('payment_details_failed', data);

export const dispatchCommentSubmitted = (data = {}) =>
  dispatchCustomEvent('comment', {
    detail: {
      article_title,
      article_id,
      article_author,
      ...data,
    },
  });

export const dispatchShowCommentsClick = (data = {}) =>
  dispatchCustomEvent('show_comments_click', {
    detail: {
      article_title,
      article_id,
      article_author,
      ...data,
    },
  });

export const dispatchFlagCommentClick = (data = {}) =>
  dispatchCustomEvent('flag_comment_click', {
    detail: {
      article_title,
      article_id,
      article_author,
      ...data,
    },
  });

export const dispatchVoteCommentClick = (data = {}) =>
  dispatchCustomEvent('vote_comment_click', {
    detail: {
      article_title,
      article_id,
      article_author,
      ...data,
    },
  });

export const dispatchLoadMoreComments = (data = {}) =>
  dispatchCustomEvent('load_more_comments', {
    detail: {
      article_title,
      article_id,
      article_author,
      ...data,
    },
  });

export const dispatchIpTabClick = (data = {}) =>
  dispatchCustomEvent('ip_tab_click', data);

export const dispatchIpEventClick = (data = {}) =>
  dispatchCustomEvent('ip_event_click', data);

export const dispatchIpEBookClick = (data = {}) =>
  dispatchCustomEvent('ip_ebook_click', data);

export const dispatchIpDownloadClick = (data = {}) =>
  dispatchCustomEvent('ip_download_click', data);

export const dispatchCompletePurchase = (data = {}) =>
  dispatchCustomEvent('complete_purchase', data);

export const dispatchPushNotificationShown = (data = {}) =>
  dispatchCustomEvent('push_notification_shown', data);

export const dispatchPushNotificationOptIn = (data = {}) =>
  dispatchCustomEvent('push_notification_optin', data);

export const dispatchPushNotificationDismiss = (data = {}) =>
  dispatchCustomEvent('push_notification_dismiss', data);

export const dispatchLiveBlogBulletedListClick = (data = {}) =>
  dispatchCustomEvent('liveblog_bulleted_list_click', data);

export const dispatchArticleBulletedListClick = (data = {}) =>
  dispatchCustomEvent('article_bulleted_list_click', data);

export const dispatchBlogPostArticleLinkClick = (data = {}) =>
  dispatchCustomEvent('blog_post_article_link_click', data);

export const dispatchRegistrationWallClick = (data = {}) =>
  dispatchCustomEvent('registration_wall_click', data);
