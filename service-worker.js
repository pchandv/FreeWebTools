// Increment the version to bust the cache when deploying a new release
const CACHE_VERSION = 'v3';
const CACHE_NAME = `free-web-tools-${CACHE_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/app.js',
  './modules/imagesToPdf.js',
  './modules/jsonToDataTable.js',
  './modules/jsonTreeView.js',
  './modules/about.js',
  './modules/pdfToWord.js',
  './modules/wordToPdf.js',
  './modules/wysiwyg.js',
  './modules/xmlJson.js',
  './modules/apiTester.js',
  './modules/websocketTester.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  'https://cdn.jsdelivr.net/npm/datatables.net@1.13.5/js/jquery.dataTables.min.js',
  'https://cdn.jsdelivr.net/npm/datatables.net-dt@1.13.5/css/jquery.dataTables.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Remove old caches when activating the new service worker
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith('free-web-tools-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
    const clients = await self.clients.matchAll();
    clients.forEach(client => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
  })());
});

// Allow the page to trigger skipWaiting
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkResp => {
        // Runtime cache for modules and CDN resources
        if (event.request.url.startsWith(self.location.origin + '/modules/') ||
            event.request.url.includes('cdn.jsdelivr.net')) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResp.clone()));
        }
        return networkResp;
      });
    })
  );
});
