export const buildNewslettersArray = (newsletter, offer) => {
  const newsletters = [];

  if (newsletter) {
    newsletters.push(newsletter);
  }

  if (offer) {
    newsletters.push('receiveIndyOffers');
  }

  return newsletters;
};
