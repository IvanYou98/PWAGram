self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open('static')
            .then(cache => {
                console.log('[Servie Worker]: precaching app shell...');
                cache.addAll([
                    '/',
                    '/src/js/app.js',
                    'index.html'
                ])
            })
    )

});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    const request = event.request;
    event.respondWith(
        caches.match(request)
            .then(response => {
                // check if we have a valid response
                return response ? response : fetch(request);
            })
    );
})
