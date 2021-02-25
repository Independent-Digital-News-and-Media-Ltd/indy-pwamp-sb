export const buildRequestBody = (state, token) => {
  const newsletters = state.data?.newsletters?.intransit || [];

  if (state.offers) {
    newsletters.push('receiveIndyOffers');
  }

  return {
    email: state.data?.email?.value || '',
    newsletters,
    grecaptcha_token: token,
  };
};
