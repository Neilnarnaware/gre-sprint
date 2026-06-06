/* GRE Sprint — sw.js
   If hosted in a subfolder (e.g. /gre-sprint/), change BASE below to match. */
const BASE  = '';   // e.g. '/gre-sprint' — no trailing slash
const CACHE = 'gre-sprint-v1';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/style.css',
  BASE + '/data.js',
  BASE + '/moti.js',
  BASE + '/app.js',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
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
      })
    )
  );
});
