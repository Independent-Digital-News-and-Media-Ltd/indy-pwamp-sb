import { newsletters } from '../../../config/newsletters/names';

export const getNewsletterName = (key) => {
  return newsletters[key] || '';
};
