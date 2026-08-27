const CACHE_NAME = 'ph-trigo-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o service worker e faz o cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições e serve do cache caso esteja offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache se existir
        }
        return fetch(event.request); // Se não, busca da rede
      })
  );
});