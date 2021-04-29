export const buildNewslettersObject = (newsletter, offer) => {
  const newsletters = {};

  if (newsletter) {
    newsletters[newsletter] = true;
  }

  if (offer) {
    newsletters['receiveIndyOffers'] = true;
  }

  return newsletters;
};
