const STATIC_ASSETS = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

const staticAssets = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/style.css',
    '/index.js',
    '/indexedDB.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_ASSETS).then(cache => cache.addAll(staticAssets))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== STATIC_ASSETS && key !== DATA_CACHE_NAME) {
                        console.log("clear cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch (event.request))
    )
});