/*globals JSGlobals */
import { loadJS } from './util';
import { EVENT_PIANO_READY } from '../constants/events';
import { getCookie, hasCookie } from './cookie';
import { COOKIE_GUID } from '../../../constants/cookies';
import { permutiveReady } from './permutive';
import { getNewsletterKeyFromArticle } from '../../../util/newsletterKey';
import { diffInDays } from '../../../util/dates';
import dayjs from 'dayjs';

import { NewslettersConfig } from '../../../config/newsletters/newslettersConfig';

const newslettersConfig = NewslettersConfig['independent.co.uk'];

const loadPianoScript = async () => {
  if (JSGlobals?.article?.isArticlePreview === true) return;
  await loadJS([
    JSGlobals?.pianoEnvironment === 'development'
      ? 'https://sandbox.tinypass.com/xbuilder/experience/load?aid=bhx3BCVktB'
      : 'https://experience.tinypass.com/xbuilder/experience/load?aid=SEz5CAOYyJ',
  ]);

  document.dispatchEvent(new CustomEvent(EVENT_PIANO_READY));
};

export const articleIsOverOneYearOld = (articleDate) => {
  const timestamp = dayjs(articleDate).unix();
  return diffInDays(timestamp) > 365;
};

const DEFAULT_SEGMENT = 'flybys';

async function getApvSegment() {
  const { apvConfig } = window.JSGlobals;
  if (apvConfig?.url === undefined) {
    console.error('APV config is incorrect. url is required.');
    return DEFAULT_SEGMENT;
  }
  let id = getCookie(COOKIE_GUID);
  let type = 'gigya';
  if (!id) {
    id = await permutiveReady();
    type = 'permutive';
  }
  let resp;
  try {
    const query = new URLSearchParams();
    query.set('type', type);
    query.set('id', id);
    resp = await fetch(`${apvConfig.url}?${query.toString()}`, {});
  } catch {
    return DEFAULT_SEGMENT;
  }
  if (resp.status === 200) {
    return await resp.text();
  }
  return DEFAULT_SEGMENT;
}

export default async () => {
  window.JSGlobals = window.JSGlobals || {
    mode: 'development',
  };

  const pianoCallback = async () => {
    // this is ok as we reassign back at bottom of this function
    let tp = window.tp || [];
    let tags = [];
    const _userRef = window._userRef;
    _userRef && tp.push(['setUserRef', _userRef]);

    if (JSGlobals.article) {
      tp.push(['setContentCreated', JSGlobals.article.publish]);
      tp.push([
        'setContentAuthor',
        JSGlobals.article.authors && JSGlobals.article.authors[0].name,
      ]);
      tp.push([
        'setContentSection',
        JSGlobals.article.hierarchy && JSGlobals.article.hierarchy[0].name,
      ]);

      JSGlobals.article.isCommercialArticle && tags.push('commercial-article');
      JSGlobals.article.isCommercial && tags.push('commercial');
      JSGlobals.article.premium && tags.push('premium');
      JSGlobals.type && tags.push(JSGlobals.type);
      tags.push('article');
    } else if (
      JSGlobals.pageType === 'category' ||
      JSGlobals.pageType === 'index'
    ) {
      tags.push('section');
    }

    tp.push([
      'addHandler',
      'checkoutCustomEvent',
      (event) => {
        if (event && event.eventName === 'offer-close-modal') {
          const footerPrompt = document.getElementById('footerPrompt');
          if (footerPrompt) {
            footerPrompt.classList.add('hide');
          }
        }
      },
    ]);

    if (JSGlobals.isSection) {
      const newsletterCompEl = document.getElementById('newsletter-component');

      if (newsletterCompEl) {
        const newsletterKey = newsletterCompEl.getAttribute(
          'data-newsletter-key',
        );

        if (newsletterKey) {
          const tag = newsletterKey.trim();

          // eslint-disable-next-line no-console
          console.log(
            '%c%s',
            'background:green;color:white;font-size:2em',
            tag,
          );
          tags.push(tag);
        }
      }
    }

    JSGlobals.topictags && tags.concat(JSGlobals.topictags);

    if (JSGlobals.article) {
      if (articleIsOverOneYearOld(JSGlobals.article.publish)) {
        tags.push('archive');
      }

      const newsletterKey = getNewsletterKeyFromArticle(
        JSGlobals.article,
        newslettersConfig,
      );

      if (newsletterKey) {
        const tag = newsletterKey.trim();

        // eslint-disable-next-line no-console
        console.log('%c%s', 'background:green;color:white;font-size:2em', tag);

        tags.push(tag);
      }
    }

    tp.push(['setTags', tags]);
    tp.push([
      'init',
      () => {
        window.tp.enableGACrossDomainLinking();
      },
    ]);

    tp.push(['setCustomVariable', 'apvSegment', await getApvSegment()]);

    window.tp = tp;

    await loadPianoScript();
  };

  if (hasCookie('esi_auth')) {
    await loadJS(['/subscriber/premium.js?r=' + new Date().getTime()]);
  }

  pianoCallback();

  try {
    await loadJS(['//www.npttech.com/advertising.js']);
  } catch (e) {
    document.cookie = '__adblocker=true;path=/';
  }

  const checkValue = (field) => {
    if (field.value !== '') {
      field.classList.add('input-has-value');
    } else {
      field.classList.remove('input-has-value');
    }
  };
  // firefox prevents styling autofilled content
  const autofilledInputFields = document.querySelectorAll(
    '.form-textfield, .form-select',
  );
  autofilledInputFields.forEach((input) => {
    checkValue(input);
    input.addEventListener('change', () => {
      checkValue(input);
    });
  });
};
