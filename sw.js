/* GRE Sprint — sw.js
   Caches relative to wherever this SW is served from, so it works at
   a domain root OR in a GitHub Pages subfolder with no edits needed. */

const CACHE = 'gre-sprint-v2';

// Derive base directory from the SW's own URL.
// e.g. https://user.github.io/gre-sprint/sw.js -> /gre-sprint/
const BASE = self.location.pathname.replace(/sw\.js$/, '');

const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'data.js',
  BASE + 'app.js',
  BASE + 'moti.js',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('jsonbin.io')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response('{"offline":true}', { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached)
    )
  );
});
