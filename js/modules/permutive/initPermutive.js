import { loadJS } from '../util';
import { getCookie } from '../cookie';

import {
  COOKIE_GUID,
  COOKIE_DEMOGRAPHICS,
} from '../../../../constants/cookies';
import { identifyUser } from './identifyUser';
import { createPermutiveStub } from './createPermutiveStub';

const load = async () => {
  const { projectId } = window.JSGlobals.permutive;

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.cmd.push(() => {
    if (window.googletag.pubads().getTargeting('permutive').length === 0) {
      const g = window.localStorage.getItem('_pdfps');
      window.googletag
        .pubads()
        .setTargeting('permutive', g ? JSON.parse(g) : []);
    }
  });

  createPermutiveStub();
  identifyUser();

  const demographics = getCookie(COOKIE_DEMOGRAPHICS);
  const gigyaId = getCookie(COOKIE_GUID);
  if (demographics && demographics.indexOf('|') > 0) {
    const [age, gender] = demographics.split('|');
    window.permutive.track('GigyaProfile', {
      age: Number(age),
      gender,
      id: gigyaId,
    });
  }
  await loadJS([`//cdn.permutive.com/${projectId}-web.js`]);
};

const pageView = () => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = days[new Date().getDay()];
  window.JSGlobals.permutive?.data &&
    window.permutive.addon('web', {
      ...window.JSGlobals.permutive.data,
      ...(window.JSGlobals.permutive?.data?.page ? {} : { page: {} }),
      context: { day_of_week: dayOfWeek },
      // @todo need a solid method for detecting user status.
      // user: { status: userStatus },
    });
};

const galleryClick = () => {
  const sendPermutiveGalleryEvent = () => {
    const galleryData = { ...window.JSGlobals.permutive.data };
    galleryData.page.content.type = 'gallery';
    window.permutive.addon('web', { page: {}, galleryData });
  };

  document.body.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('amp-carousel-button')) {
      sendPermutiveGalleryEvent();
    }
  });

  const galleryTriggers = [
    ...document.querySelectorAll('.gallery-btn, .inline-gallery-btn'),
  ];

  galleryTriggers.forEach((el) => {
    el.addEventListener('click', sendPermutiveGalleryEvent);
  });
};

const eventLegacyBestProductClick = () => {
  // @see https://www.independent.co.uk/extras/indybest/prime-day-2019-guide-best-deals-tips-amazon-sale-tech-home-appliances-latest-a9002116.html
  const legacyLinks = document.querySelectorAll(
    '.body-link[data-vars-item-name]',
  );
  legacyLinks.forEach((link) =>
    link.addEventListener('click', function (event) {
      // there is some assumed formatting here, but it's largely unavoidable
      const link = event.currentTarget;
      const linkWrapper = link.parentNode;
      // use a stepper to get the h2 directly above the link parent
      let siblingStepper = linkWrapper.previousSibling;
      while (siblingStepper?.nodeName !== 'H2') {
        siblingStepper = siblingStepper.previousSibling;
        if (siblingStepper.nodeName === 'H2') {
          const regex = /(.*):[^\d]*([\d.,\s]*),(.*)$/;
          const match = regex.exec(siblingStepper.textContent);
          if (match) {
            const affiliateData = {
              name: match[1].trim(),
              price: parseFloat(match[2].replace(',', '')),
              brand: match[3].trim(),
              currency: 'gbp',
              comparison: false,
              href: link.getAttribute('href'),
              affiliate: '',
            };
            trackAffiliateLink(affiliateData);
          }
          break;
        }
      }
    }),
  );
};

const eventBestProductClick = () => {
  const products = document.querySelectorAll('.product');
  products.forEach((product) => {
    const link = product.querySelector('.product-buy');
    const title = product.querySelector('.product-title').textContent;
    const price = parseFloat(
      product.querySelector('.product-price').textContent.replace(',', ''),
    );
    const currency = (() => {
      const symbol = product.querySelector('.product-currency').textContent;
      switch (symbol) {
        case '£':
          return 'gbp';
        case '$':
          return 'usd';
      }
    })();
    const affiliate = product.querySelector('.product-source').textContent;
    link.addEventListener('click', () => {
      trackAffiliateLink({
        name: title,
        price,
        brand: title,
        currency,
        comparison: false,
        href: link.getAttribute('href'),
        affiliate,
      });
    });

    product.addEventListener('click', (e) => {
      if (e.target.classList.contains('m101-btn')) {
        const cLink = e.target;
        const cWrapper = e.target.closest('li');
        const affiliateData = {
          name: product.querySelector('h2 .title').textContent,
          price: parseFloat(
            cWrapper
              .querySelector('.m101-price')
              .textContent.replace(',', '')
              .replace('£', ''),
          ),
          brand: product.querySelector('h2 .title').textContent,
          currency: 'gbp',
          comparison: true,
          href: cLink.getAttribute('href'),
          affiliate: cWrapper.querySelector('.m101-name').textContent,
        };
        trackAffiliateLink(affiliateData);
      }
    });
  });
};

export const trackAffiliateLink = (props) => {
  const { brand, name, price, currency, comparison, href, affiliate } = props;
  if (typeof window.permutive !== 'undefined') {
    window.permutive.track('AffiliateLinkClick', {
      product: {
        brand,
        name,
        price: {
          value: price,
          currency,
        },
      },
      comparison,
      href,
      affiliate,
    });
  }
};

export const initPermutive = async (consent) => {
  const config = window.JSGlobals.permutive;

  if (consent && config) {
    await load();
    pageView();
    galleryClick();
    eventLegacyBestProductClick();
    eventBestProductClick();
  }
};
