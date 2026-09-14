// VERSÃO ATUALIZADA - v5
const CACHE_NAME = 'ph-trigo-v5'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response; 
      return fetch(event.request);
    })
  );
});

// A MÁGICA DO ACESSO RÁPIDO: O que acontece ao tocar na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Fecha a notificação clicada
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Verifica se o app já está aberto em segundo plano e traz para a frente
      for (let client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Se estiver totalmente fechado, ele abre o app
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});