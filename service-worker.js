const CACHE_NAME = 'free-web-tools-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/app.js',
  './modules/imagesToPdf.js',
  './modules/jsonToDataTable.js',
  './modules/jsonTreeView.js',
  './modules/about.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  'https://cdn.jsdelivr.net/npm/datatables.net@1.13.5/js/jquery.dataTables.min.js',
  'https://cdn.jsdelivr.net/npm/datatables.net-dt@1.13.5/css/jquery.dataTables.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
