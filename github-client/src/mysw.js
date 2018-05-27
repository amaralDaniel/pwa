

(function() {
  'use strict';

  var staticCacheName = 'pwa-client';

  const channel = new BroadcastChannel('pwa_channel')

  self.addEventListener('install', function(event) {
    console.log('Service worker installing...');
    event.waitUntil(
      caches.open(staticCacheName)
        .then(function(cache) {
          console.log('Installed.')
        })
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', function(event) {
    console.log('Service worker activating...');


  });

  channel.onmessage = function(e) {
    //first we clean
    var repositoryName = e.data.name
    var repositoryOwner = e.data.owner

  };

  self.addEventListener('fetch', function(event) {
    console.log('Fetching:', event.request.url);

    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          if (response.status === 401) {
            return fetch(event.request).then(function (response) {
              // TODO 5 - Respond with custom 404 page

              return caches.open(staticCacheName).then(function (cache) {
                if (event.request.url.indexOf('test') < 0) {
                  cache.put(event.request.url, response.clone());
                  console.log('Cached request for ', event.request.url)
                }
                return response;
              });
            })
          }
          console.log('Found ', event.request.url, ' in cache.');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function (response) {
          // TODO 5 - Respond with custom 404 page

          return caches.open(staticCacheName).then(function (cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
              console.log('Cached request for ', event.request.url)
            }
            return response;
          });
        })
      }).catch(function (error) {
        // TODO 6 - Respond with custom offline page
      })
    )
  });

})();
