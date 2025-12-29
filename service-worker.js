const CACHE_NAME = 'profinance-cache-v1';
const urlsToCache = [
    'index.html',
    'manifest.json',
    // PWA Icon files (assuming they are in the 'icons' folder)
    'icons/icon-192x192.png', 
    'icons/icon-512x512.png', 
    // External Libraries (CDNs)
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

// Install event: Cache all required assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Use catch to prevent installation failure if a CDN fails
                return cache.addAll(urlsToCache).catch(err => {
                    console.error('Error adding assets to cache:', err);
                });
            })
    );
});

// Fetch event: Serve assets from cache if available
self.addEventListener('fetch', event => {
    // We only cache GET requests
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // No cache hit - fetch from network
                return fetch(event.request).catch(error => {
                    // Handle network failure here (e.g., if you have an offline page)
                    console.error('Fetching failed:', event.request.url, error);
                });
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});