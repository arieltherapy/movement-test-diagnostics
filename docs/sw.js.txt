const CACHE = "app-offline-v1";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache-first + שמירה דינמית של קבצים שנשלפים מהרשת
self.addEventListener("fetch", e => {
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;
    try {
      const resp = await fetch(e.request);
      const cache = await caches.open(CACHE);
      cache.put(e.request, resp.clone());
      return resp;
    } catch {
      return caches.match("./"); // נפילה לדף הבית כשאין רשת
    }
  })());
});
