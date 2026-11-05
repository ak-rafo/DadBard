/* Dad Bard offline cache. Bump VERSION whenever you upload a new index.html. */
var VERSION = 'dadbard-v5.5.0';
var FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return Promise.all(FILES.map(function (f) { return c.add(f).catch(function () {}); })); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () { caches.match(e.request, { ignoreSearch: true }).then(function (r) { if (r && !done) { done = true; resolve(r); } }); }, 3000);
    fetch(e.request).then(function (res) {
      clearTimeout(t); var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      if (!done) { done = true; resolve(res); }
    }).catch(function () {
      clearTimeout(t);
      caches.match(e.request, { ignoreSearch: true }).then(function (r) { if (!done) { done = true; resolve(r || caches.match('./index.html')); } });
    });
  }));
});
