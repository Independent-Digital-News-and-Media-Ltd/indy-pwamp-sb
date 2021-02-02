import { storeDigitalData } from './modules/digitalData';
import { dispatchDonation } from './modules/customEvents';
import { showPianoOffer } from './modules/piano';

const donationFormCheckboxes = document.querySelectorAll(
  '#donation-form input[type=checkbox]',
);

const donationPromptStickyOtherOptionsCheckboxes = document.querySelectorAll(
  '#donation-prompt-sticky-other-options input[type=checkbox]',
);

const checkboxesSticky = document.querySelectorAll(
  '#donation-prompt-sticky-contribute input[type=checkbox]',
);

const termSelectors = document.querySelectorAll(
  '.frequency-options, .amount-options',
);
const frequencySelector = document.querySelectorAll('.frequency-options');

const purchaseButtons = document.querySelectorAll('.donation-purchase-btn');

purchaseButtons.forEach((purchaseBtn) => {
  purchaseBtn?.addEventListener('click', (event) => {
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
});

const donationForm = document.querySelector('#donation-form');

const donationPromptStickyContribute = document.querySelector(
  '#donation-prompt-sticky-contribute',
);

const donationBarSticky = document.querySelector('#donation-bar-sticky');

const donationPromptStickyOtherOptions = document.querySelector(
  '#donation-prompt-sticky-other-options',
);

const purchaseBtnSticky = document.querySelector(
  '.donation-purchase-btn-sticky',
);

const otherOptionsBtnSticky = document.querySelector(
  '.donation-other-options-btn-sticky',
);

purchaseBtnSticky.addEventListener('click', () => {
  donationPromptStickyContribute.classList.toggle('hidden');
  setTimeout(function () {
    donationPromptStickyContribute.classList.toggle('closed');
    donationPromptStickyContribute.style.zIndex = '5';
    donationBarSticky.classList.toggle('hidden');
  }, 100);
});

otherOptionsBtnSticky.addEventListener('click', () => {
  donationPromptStickyOtherOptions.classList.toggle('hidden');
  setTimeout(function () {
    donationPromptStickyOtherOptions.classList.toggle('closed');
    donationPromptStickyOtherOptions.style.zIndex = '5';
    donationBarSticky.classList.toggle('hidden');
  }, 100);
});

const hideDonationStickyPromptIconContribute = document.querySelector(
  '#hide-donation-sticky-prompt-contribute',
);

hideDonationStickyPromptIconContribute.addEventListener('click', () => {
  donationPromptStickyContribute.classList.toggle('closed');
  donationPromptStickyContribute.style.zIndex = '4';
  donationBarSticky.classList.toggle('hidden');
  setTimeout(function () {
    donationPromptStickyContribute.classList.toggle('hidden');
  }, 500);
});

const hideDonationStickyPromptIconOtherOptions = document.querySelector(
  '#hide-donation-sticky-prompt-other-options',
);

hideDonationStickyPromptIconOtherOptions.addEventListener('click', () => {
  donationPromptStickyOtherOptions.classList.toggle('closed');
  donationPromptStickyOtherOptions.style.zIndex = '4';
  donationBarSticky.classList.toggle('hidden');
  setTimeout(function () {
    donationPromptStickyOtherOptions.classList.toggle('hidden');
  }, 500);
});

const purchaseBtnStickyConfirm = document.querySelector(
  '.donation-purchase-btn-sticky-confirm',
);

purchaseBtnStickyConfirm.addEventListener('click', (event) => {
  //Show Donation Sticky prompt
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
donationFormCheckboxes.forEach((checkbox) => {
  let purchaseBtn = donationForm.querySelector('.donation-purchase-btn');
  checkbox.addEventListener('change', () => {
    let tickedBoxes = true;
    [].forEach.call(donationFormCheckboxes, (box) => {
      if (!box.checked) tickedBoxes = false;
    });
    purchaseBtn.disabled = !tickedBoxes;
  });
});

donationPromptStickyOtherOptionsCheckboxes.forEach((checkbox) => {
  let purchaseBtn = donationPromptStickyOtherOptions.querySelector(
    '.donation-purchase-btn',
  );
  checkbox.addEventListener('change', () => {
    let tickedBoxes = true;
    [].forEach.call(donationPromptStickyOtherOptionsCheckboxes, (box) => {
      if (!box.checked) tickedBoxes = false;
    });
    purchaseBtn.disabled = !tickedBoxes;
  });
});

checkboxesSticky.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    let tickedBoxes = true;
    [].forEach.call(checkboxesSticky, (box) => {
      if (!box.checked) tickedBoxes = false;
    });
    purchaseBtnStickyConfirm.disabled = !tickedBoxes;
  });
});

termSelectors.forEach((selector) => {
  selector.addEventListener('change', (e) => {
    let purchaseBtn = e.target.classList.contains('frequency-options')
      ? e.target.parentElement.querySelector('.donation-purchase-btn')
      : e.target.parentElement.parentElement.querySelector(
          '.donation-purchase-btn',
        );
    const length = e.target.classList.contains('frequency-options')
      ? e.target.parentElement.querySelector('.frequency-options :checked')
      : e.target.parentElement.parentElement.querySelector(
          '.frequency-options :checked',
        );
    const price = e.target.classList.contains('frequency-options')
      ? e.target.parentElement.querySelector('.amount-options :checked')
      : e.target.parentElement.parentElement.querySelector(
          '.amount-options :checked',
        );

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
    const length = selector.parentElement.querySelector(
      '.frequency-options :checked',
    );
    const inputs = selector.parentElement.querySelectorAll(
      '.amount-options input',
    );
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

//Gallery Donation Section
setInterval(function () {
  const gallery_donation_sections = document.querySelectorAll(
    '.gallery-donation-section',
  );
  gallery_donation_sections.forEach((gallery_donation_section) => {
    if (!gallery_donation_section.classList.contains('gallery-image-2')) {
      gallery_donation_section.classList.toggle('gallery-image-2');
    } else if (
      !gallery_donation_section.classList.contains('gallery-image-3')
    ) {
      gallery_donation_section.classList.toggle('gallery-image-3');
    } else if (gallery_donation_section.classList.contains('gallery-image-3')) {
      gallery_donation_section.classList.toggle('gallery-image-3');
      gallery_donation_section.classList.toggle('gallery-image-2');
    }
  });
}, 4000);

// Hide Donation Form for FAQ section
// Set Donation Form Wrapper position to fixed after a certain scrollTop
function hideDonationFormOnFAQSection() {
  if (
    document.documentElement.scrollWidth >= 985 &&
    document.documentElement.scrollWidth < 1280
  ) {
    if (
      document.documentElement.scrollTop /
        document.documentElement.scrollWidth >
      2.4
    ) {
      donationForm.classList.add('hidden');
    } else {
      donationForm.classList.remove('hidden');
    }
  } else if (
    document.documentElement.scrollWidth >= 1280 &&
    document.documentElement.scrollWidth < 1440
  ) {
    if (
      document.documentElement.scrollTop /
        document.documentElement.scrollWidth >
      1.8
    ) {
      donationForm.classList.add('hidden');
    } else {
      donationForm.classList.remove('hidden');
    }
  } else if (document.documentElement.scrollWidth >= 1440) {
    if (
      document.documentElement.scrollTop /
        document.documentElement.scrollWidth >
      1.7
    ) {
      donationForm.classList.add('hidden');
    } else {
      donationForm.classList.remove('hidden');
    }
  }
}

window.onscroll = function () {
  hideDonationFormOnFAQSection();
};

const hideDonationFormOnDocumentReady = function () {
  if (document.readyState === 'complete') {
    hideDonationFormOnFAQSection();
  } else {
    setTimeout(function () {
      hideDonationFormOnDocumentReady();
    }, 100);
  }
};

hideDonationFormOnDocumentReady();
