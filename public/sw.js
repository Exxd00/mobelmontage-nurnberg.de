const offlineCache = 'mobelmontage-offline-v2';
const offlinePage = '/offline.html';
const obsoleteCaches = ['static-v1', 'dynamic-v1', 'mobelmontage-v1'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(offlineCache);
    await cache.add(new Request(offlinePage, { cache: 'reload' }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all(obsoleteCaches.map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /^\/(api|admin|thank-you)(\/|$)/.test(url.pathname)) return;

  event.respondWith(fetch(request).catch(async () => {
    const fallback = await caches.match(offlinePage, { cacheName: offlineCache });
    return fallback || new Response('Offline', { status: 503 });
  }));
});

self.addEventListener('push', (event) => {
  event.waitUntil(self.registration.showNotification('Möbelmontage Nürnberg', {
    body: event.data ? event.data.text() : 'Neue Nachricht von Möbelmontage Nürnberg',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});
