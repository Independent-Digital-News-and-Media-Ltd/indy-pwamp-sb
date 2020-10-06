'use strict';

import { triggerOnScrolledIntoView } from './util';

const Apester = (callback) => {
  const apesterElem = document.querySelector('interaction.apester-media');

  if (!apesterElem) {
    return;
  }

  const initApester = () => {
    const existingScript = document.getElementById('apesterScript');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://static.apester.com/js/sdk/latest/apester-sdk.js';
      script.id = 'apesterScript';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (callback) callback();
      };
    } else if (callback) {
      callback();
    }
  };

  triggerOnScrolledIntoView([apesterElem], initApester, { tolerance: 500 });
};
export default Apester;
