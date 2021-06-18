import { NEWSLETTERS_PAGE_RSM } from '../../../../constants/regSourceMethods';

export const buildRequestBody = (state = {}, token) => {
  const newsletters = [...state.data?.newsletters?.intransit];

  if (state.data?.offers) {
    newsletters.push('receiveIndyOffers');
  }

  return {
    email: state.data?.email?.value || '',
    newsletters,
    grecaptcha_token: token,
    regSourceMethod: encodeURIComponent(NEWSLETTERS_PAGE_RSM),
  };
};
