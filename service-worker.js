// service-worker.js - VERSÃO SIMPLIFICADA
const CACHE_NAME = 'gala-juvenil-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache instalado');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - CORREÇÃO CRÍTICA: Não cachear URLs com parâmetros
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // NÃO cachear requisições com parâmetros (links de convite)
  if (url.search.includes('nome=') || url.search.includes('share=')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Para outras requisições, usar cache com fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Só cachear se for uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback para página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});