/*globals importScripts, workbox*/
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js',
);
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Less console logging
workbox.setConfig({ debug: false });

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// CSS / JS.
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate(),
);

// Static images.
workbox.routing.registerRoute(
  new RegExp('^/img/.*(?:png|gif|jpg|jpeg|svg)'),
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

// Network only.
workbox.routing.registerRoute(
  '/login-authorization.json',
  workbox.strategies.networkOnly(),
);
workbox.routing.registerRoute(
  new RegExp('/account'),
  workbox.strategies.networkOnly(),
);

// Everything else - go to the network and fallback to offline page.
workbox.routing.registerRoute(new RegExp('/(.*)'), (args) => {
  return workbox.strategies
    .networkFirst()
    .handle(args)
    .then((response) => {
      if (!response) {
        return caches.match(new Request('/offline'));
      }
      return response;
    });
});

// Offline analytics.
workbox.googleAnalytics.initialize();
