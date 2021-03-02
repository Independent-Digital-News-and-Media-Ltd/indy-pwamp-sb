import {
  jsLoader,
  cssLoader,
} from '@brightsites/flow-core/lib/utils/fileLoaders';

export const hasParameter = (name, url = null) => {
  const escapeRegExp = (value) =>
    value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const re = new RegExp(
    '[\\?|\\&]' + escapeRegExp(encodeURIComponent(name)) + '\\b',
  );
  return re.test(url || window.location.href);
};

export const isUUIDv4 = (str) =>
  ('' + str).match(
    '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$',
  );

export const getWindowWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

export const triggerOnScrolledIntoView = (
  elements,
  callback,
  { tolerance = 0 },
) => {
  if (!elements || !elements.length) {
    return;
  }

  const thingsToObserve = Array.isArray(elements) ? elements : [elements];

  const observer = new IntersectionObserver(
    (items) => {
      if (items.some(({ isIntersecting }) => isIntersecting)) {
        observer.disconnect();

        callback();
      }
    },
    { rootMargin: `${tolerance}px` },
  );

  thingsToObserve.forEach((elem) => {
    observer.observe(elem);
  });
};

export const loadJS = (urls) =>
  new Promise((resolve, reject) => jsLoader(urls, resolve, reject));

export const loadCSS = (urls) =>
  new Promise((resolve, reject) => cssLoader(urls, resolve, reject));
