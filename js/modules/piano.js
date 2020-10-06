export const showPianoOffer = (offerId, termId) => {
  const tp = window.tp || [];
  tp.offer.show({
    offerId: offerId,
    termId: termId,
  });
};
