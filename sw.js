const CACHE_NAME = 'p360-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Event: Cache new assets
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force active immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate Event: Delete OLD caches automatically
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Wipe old cached index.html
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Serve cached content offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});