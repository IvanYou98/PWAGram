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
})


// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.open(LATEST_DYNAMIC_CACHE)
//             .then(function(cache) {
//                 return fetch(event.request)
//                     .then(function(res) {
//                         cache.put(event.request, res.clone());
//                         return res;
//                     });
//             })
//     );
// });

// self.addEventListener('fetch', event => {
//     const request = event.request;
//     event.respondWith(
//         fetch(request).then(response => {
//             caches.open(LATEST_DYNAMIC_CACHE).then(cache => {
//                 cache.put(request.url, response.clone());
//                 return response;
//             })
//         }).catch(err => {
//             console.log(err);
//         })
//         // caches.match(request).then(matchResult => {
//         //     // check if we have a valid matchResult
//         //     // if (matchResult) return matchResult;
//         //     // fetch(request).then(response => {
//         //     //     return response;
//         //     // }).catch(err => {
//         //     //     console.log(err);
//         //     // })
//         //     fetch(request).then(res => {
//         //         caches.open(LATEST_DYNAMIC_CACHE).then(cache => {
//         //             cache.put(request.url, res.clone());
//         //             return res;
//         //         })
//         //     }).catch(err => {
//         //         console.log(err);
//         //     })
//         // })
//     );
// })
