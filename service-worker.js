let cacheName='v0.1';

let cacheFiles = [
	'./',
	'./index.html',
	'./app.js',
  './style.css',
  './column.js',
  './note.js',
  './trash.png',
  './indexDB.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(cacheName).then((cache) => {
        console.log('caching shell assets');
        cache.addAll(cacheFiles);
      })
    );
  });

self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(keys
          .filter(key => key !== cacheName)
          .map(key => caches.delete(key))
        );
      })
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then(cacheRes => {
        return cacheRes || fetch(event.request);
      })
    );
  });