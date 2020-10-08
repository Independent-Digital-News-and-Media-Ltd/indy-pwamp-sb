import { storeDigitalData } from './modules/digitalData';
import { dispatchDonationButtonClick } from './modules/customEvents';
import { showPianoOffer } from './modules/piano';

const checkboxes = document.querySelectorAll(
  '#donation-form input[type=checkbox]',
);
const termSelectors = document.querySelectorAll(
  '.frequency-options, .amount-options',
);
const frequencySelector = document.querySelector('.frequency-options');

const purchaseBtn = document.querySelector('.donation-purchase-btn');
purchaseBtn.addEventListener('click', (event) => {
  const {
    offerId,
    termId,
    trackingPrice,
    trackingLength,
    trackingName,
  } = event.target.dataset;

  const trackingData = {
    subscription_length: trackingLength,
    subscription_price: trackingPrice,
    subscription_package: trackingName,
  };

  storeDigitalData(trackingData);

  dispatchDonationButtonClick({
    ...trackingData,
  });

  showPianoOffer(offerId, termId);
});

// IE11 cannot loop through NodeLists

[].forEach.call(checkboxes, (checkbox) => {
  checkbox.addEventListener('change', () => {
    let tickedBoxes = true;
    [].forEach.call(checkboxes, (box) => {
      if (!box.checked) tickedBoxes = false;
    });
    purchaseBtn.disabled = !tickedBoxes;
  });
});

[].forEach.call(termSelectors, (selector) => {
  selector.addEventListener('change', () => {
    const length = document.querySelector('.frequency-options :checked');
    const price = document.querySelector('.amount-options :checked');
    purchaseBtn.dataset.termId = price.dataset[length.value];
  });
});

frequencySelector.addEventListener('change', () => {
  const length = document.querySelector('.frequency-options :checked');

  const inputs = document.querySelectorAll('.amount-options input');
  [].forEach.call(inputs, (selector) => {
    const id = selector.id;

    const label = document.querySelector('label[for=' + id + ']');

    if (length.value === 'monthly') {
      selector.dataset.trackingPrice = selector.dataset.trackingPriceMonthly;
      label.innerHTML =
        selector.dataset.currencySymbol + selector.dataset.monthlyPrice;
    } else if (length.value === 'single') {
      selector.dataset.trackingPrice = selector.dataset.trackingPriceSingle;
      label.innerHTML =
        selector.dataset.currencySymbol + selector.dataset.singlePrice;
    }
  });
});
