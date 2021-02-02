/*globals JSGlobals */
import { loadJS } from './util';
import { EVENT_PIANO_READY } from '../constants/events';

const loadPianoScript = async () => {
  await loadJS([
    JSGlobals?.pianoEnvironment === 'development'
      ? 'https://sandbox.tinypass.com/xbuilder/experience/load?aid=bhx3BCVktB'
      : 'https://experience.tinypass.com/xbuilder/experience/load?aid=SEz5CAOYyJ',
  ]);

  document.dispatchEvent(new CustomEvent(EVENT_PIANO_READY));
};

export default async () => {
  window.JSGlobals = window.JSGlobals || {
    mode: 'development',
  };

  const pianoCallback = async () => {
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

    JSGlobals.topictags && tags.concat(JSGlobals.topictags);

    tp.push(['setTags', tags]);
    tp.push([
      'init',
      () => {
        window.tp.enableGACrossDomainLinking();
      },
    ]);

    window.tp = tp;

    await loadPianoScript();
  };

  await loadJS(['/subscriber/premium.js?r=' + new Date().getTime()]);

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
