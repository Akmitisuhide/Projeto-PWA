const CACHE_NAME = 'vagas-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/register-service-worker.js',
    '/service-worker.js',
    '/assets/icons/apple-touch-icon.png',
    '/assets/icons/favicon-16x16.png',
    '/assets/icons/favicon-32x32.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-320x320.png',
    '/assets/icons/icon-512x512.png',
]

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => console.error('[Service Worker] Falha ao cachear:', error))
    );
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Removendo cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); 
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetch:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request).catch(() => caches.match('/offline.html'));
            })
            .catch((error) => console.error('[Service Worker] Falha ao buscar:', error))
    );
});
