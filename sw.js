let static_cache = 'resto-cache-v1';
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(static_cache).then(function(cache) {
      return cache.addAll([
        '/',
        'css/styles.css',
        'data/restaurants.json',
        'img/',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('resto-cache-') && cacheName != static_cache;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })    
      );
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        // console.log('Cache contains item: ', event.request.url);
        return response;
      }
    //   console.log('Cache not found, network will request for: ', event.request.url);
      return fetch(event.request).then(function(response) {
        if (response.status === 404) {
        //   console.log('Seems there is no valid response to the request.');
          return;
        }
        return caches.open(static_cache).then(function(cache) {
          return response;
        })
      })
    }).catch(function(error) {
    //   console.log('Error message on fetch: ', error);
      return;
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});