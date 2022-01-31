const cacheName = 'roth-3d-cache-v4';
const assets = ['/', '/index.html', '/bundle.js', '/icons/*', '/model-viewer.min.js'];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!cacheName.includes(key)) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => {
        console.log('New version now ready to handle fetches!');
      })
  );
});
