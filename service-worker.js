
const CACHE_NAME = 'pro-finance-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // './icon-192x192.png', // Uncomment if icons exist
    // './icon-512x512.png'  // Uncomment if icons exist
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
