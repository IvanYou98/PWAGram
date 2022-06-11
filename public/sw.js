importScripts('/src/js/idb.js');

const LATEST_STATIC_CACHE = 'static-v1'
const LATEST_DYNAMIC_CACHE = 'dynamic-v3'

self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(LATEST_STATIC_CACHE)
            .then(cache => {
                console.log('[Servie Worker]: precaching app shell...');
                cache.addAll([
                    '/',
                    '/src/js/app.js',
                    '/src/js/idb.js',
                    '/src/js/feed.js',
                    '/src/js/fetch.js',
                    '/src/js/promise.js',
                    '/index.html',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    '/src/js/material.min.js',
                    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                    'https://fonts.gstatic.com/s/materialicons/v129/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
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
    const url = 'https://pwabackend-a5bf7-default-rtdb.firebaseio.com/posts.json';
    // if we are reaching to the backend
    if (event.request.url.indexOf(url) == 0) {
        event.respondWith(
            caches.open(LATEST_DYNAMIC_CACHE)
                .then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                        .catch(err => {
                            return caches.match(event.request);
                        })
                })
        )
    } else {
        event.respondWith(
            caches.match(event.request).then(
                matchResult => {
                    console.log('Find something in the cache...')
                    if (matchResult) return matchResult;
                    return fetch(event.request).then(
                        response => {
                            caches.open(LATEST_DYNAMIC_CACHE).then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            })
                        }
                    )
                }
            )
        )
    }

})
