importScripts('../common/util/serviceworker-cache-polyfill.js');
var CACHE_NAME = "registration-cache";

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.put('/', new Response("start caching"));
        })
    );
});
var isAStaticResource = function (url) {
    return url.slice(-2) == "js" || url.slice(-3) == "css" || url.slice(-3) == "ttf" || url.slice(-4) == "html"
};

self.addEventListener('fetch', function (event) {
    var url = event.request.url;
    event.respondWith(
        caches.match(url)
            .then(function (response) {
                if (response) {
                    return response;
                }
                var fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        if (isAStaticResource(url)) {
                            var responseToCache = response.clone();

                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(url, responseToCache);
                                });
                        }
                        return response;
                    }
                );
            })
    );
});