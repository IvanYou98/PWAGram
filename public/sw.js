const LATEST_STATIC_CACHE = 'static-v6'
const LATEST_DYNAMIC_CACHE = 'dynamic'

self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(LATEST_STATIC_CACHE)
            .then(cache => {
                console.log('[Servie Worker]: precaching app shell...');
                cache.addAll([
                    '/',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/fetch.js',
                    '/src/js/promise.js',
                    '/index.html',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg'
                ])
            })
    )

});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ...', event);
    event.waitUntil(
        caches.keys().then(keyList => {
                Promise.all(keyList.map(key => {
                    if (key !== LATEST_STATIC_CACHE && key !== LATEST_DYNAMIC_CACHE) {
                        return caches.delete(key);
                    }
                }))
            }
        )
    )
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    const request = event.request;
    event.respondWith(
        caches.match(request).then(matchResult => {
            // check if we have a valid matchResult
            if (matchResult) return matchResult
            fetch(request).then(res => {
                caches.open(LATEST_DYNAMIC_CACHE).then(cache => {
                    cache.put(request.url, res.clone());
                    return res;
                })
            }).catch(err => {
                console.log(err);
            })
        })
    );
})
