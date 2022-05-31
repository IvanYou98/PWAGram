self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker in a new version ...', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetching something...', event);
});

