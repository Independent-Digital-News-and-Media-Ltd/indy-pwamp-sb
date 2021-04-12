import { getNewsletterName } from '../../../utils/getNewsletterName';

export const buildNewsletterTrackingArray = (newsletterKeys) => {
  return newsletterKeys
    .map((key) => getNewsletterName(key))
    .filter((item) => !!item)
    .join(',');
};
