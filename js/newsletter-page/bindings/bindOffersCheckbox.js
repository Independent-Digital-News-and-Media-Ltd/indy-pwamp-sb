import { OFFERS_CHECKBOX_ID } from '../constants';

export const bindOffersCheckbox = (state) => {
  const offersCheckbox = document.getElementById(OFFERS_CHECKBOX_ID);

  offersCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      state.selectOffers();
    } else {
      state.deselectOffers();
    }
  });
};
