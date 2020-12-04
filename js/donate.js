import { storeDigitalData } from './modules/digitalData';
import { dispatchDonation } from './modules/customEvents';
import { showPianoOffer } from './modules/piano';

const checkboxes = document.querySelectorAll(
  '#donation-form input[type=checkbox]',
);
const termSelectors = document.querySelectorAll(
  '.frequency-options, .amount-options',
);
const frequencySelector = document.querySelectorAll('.frequency-options');

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

  dispatchDonation({
    ...trackingData,
  });

  showPianoOffer(offerId, termId);
});

// IE11 cannot loop through NodeLists

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    let tickedBoxes = true;
    [].forEach.call(checkboxes, (box) => {
      if (!box.checked) tickedBoxes = false;
    });
    purchaseBtn.disabled = !tickedBoxes;
  });
});

termSelectors.forEach((selector) => {
  selector.addEventListener('change', () => {
    const length = document.querySelector('.frequency-options :checked');
    const price = document.querySelector('.amount-options :checked');

    purchaseBtn.dataset.termId = price.dataset[length.value];
    if (length.value === 'monthly') {
      purchaseBtn.dataset.trackingPrice =
        price.dataset.currencyName +
        Number(price.dataset.monthlyPrice).toFixed(2);
    } else if (length.value === 'single') {
      purchaseBtn.dataset.trackingPrice =
        price.dataset.currencyName +
        Number(price.dataset.singlePrice).toFixed(2);
    }
    purchaseBtn.dataset.trackingLength = length.dataset.trackingLength;
    purchaseBtn.dataset.trackingName = length.dataset.trackingName;
  });
});

frequencySelector.forEach((selector) => {
  selector.addEventListener('change', () => {
    const length = document.querySelector('.frequency-options :checked');
    const inputs = document.querySelectorAll('.amount-options input');
    inputs.forEach((selector) => {
      const id = selector.id;
      const label = document.querySelector('label[for=' + id + ']');

      if (length.value === 'monthly') {
        label.innerHTML =
          selector.dataset.currencySymbol + selector.dataset.monthlyPrice;
      } else if (length.value === 'single') {
        label.innerHTML =
          selector.dataset.currencySymbol + selector.dataset.singlePrice;
      }
    });
  });
});
