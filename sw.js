/* Offline cache. Bump VERSION whenever you upload changed files so phones pick them up. */
var VERSION = 'dadbard-v4.0.0';
var FILES = ['./', './index.html', './app.js', './data.js', './andrew.js', './variations.js', './evolution.js', './apothecary.js', './views.js', './calc.js', './tests.js', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
/* Network first (fresh when online), cache fallback (works offline / weak signal after 3 s). */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () { caches.match(e.request, { ignoreSearch: true }).then(function (r) { if (r && !done) { done = true; resolve(r); } }); }, 3000);
    fetch(e.request).then(function (res) {
      clearTimeout(t);
      var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      if (!done) { done = true; resolve(res); }
    }).catch(function () {
      clearTimeout(t);
      caches.match(e.request, { ignoreSearch: true }).then(function (r) { if (!done) { done = true; resolve(r || caches.match('./index.html')); } });
    });
  }));
});
