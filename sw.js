// Configurações do Service Worker
const CACHE_NAME = 'gala-juvenil-v3';
const OFFLINE_URL = '/offline.html';

// Assets para cache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  
  // Recursos locais
  'logo.png',
  'icon-192.png',
  'icon-512.png',
  
  // Recursos externos (cache em tempo de execução)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&family=Dancing+Script:wght@400;700&display=swap',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pré-cache de arquivos estáticos');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Instalação completa');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Erro na instalação:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Ativação completa');
      return self.clients.claim();
    })
  );
});

// Estratégia de cache: Network First, com fallback para cache
self.addEventListener('fetch', event => {
  // Ignorar requisições não GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições de chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Para requisições de API, usar Network Only
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Para imagens, usar Cache First
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Atualizar cache em background
            fetchAndCache(event.request);
            return cachedResponse;
          }
          return fetchAndCache(event.request);
        })
        .catch(() => {
          // Fallback para imagem genérica se offline
          if (event.request.url.includes('.png') || 
              event.request.url.includes('.jpg') || 
              event.request.url.includes('.jpeg')) {
            return caches.match('/icon-192.png');
          }
        })
    );
    return;
  }
  
  // Para HTML, CSS, JS: Network First, com fallback para cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar resposta para cache
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(error => {
        console.log('[Service Worker] Offline, usando cache:', error);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Se for uma página HTML e não tiver cache, mostrar offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Função para buscar e cachear
function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // Verificar se a resposta é válida
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      // Clonar resposta para cache
      const responseToCache = response.clone();
      
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, responseToCache);
        });
      
      return response;
    })
    .catch(error => {
      console.error('[Service Worker] Erro ao buscar:', error);
      throw error;
    });
}

// Mensagens do Service Worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-invites') {
    console.log('[Service Worker] Sincronizando convites...');
    event.waitUntil(syncInvites());
  }
});

// Função de sincronização (exemplo)
function syncInvites() {
  // Aqui você implementaria a sincronização com um servidor
  // Por enquanto, apenas log
  console.log('[Service Worker] Sincronização concluída');
  return Promise.resolve();
}

// Notificações push
self.addEventListener('push', event => {
  console.log('[Service Worker] Notificação push recebida.');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Gala Juvenil 2025';
  const options = {
    body: data.body || 'Novo convite disponível!',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Clique em notificações
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notificação clicada:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Abrir/focar a aplicação
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Verificar se já existe uma janela aberta
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Se não existir, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

// Atualização de conteúdo em background
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    console.log('[Service Worker] Atualizando conteúdo em background...');
    event.waitUntil(updateContent());
  }
});

// Função de atualização de conteúdo
function updateContent() {
  return fetch('/api/updates')
    .then(response => {
      if (!response.ok) throw new Error('Falha na atualização');
      return response.json();
    })
    .then(updates => {
      console.log('[Service Worker] Conteúdo atualizado:', updates);
      // Aqui você processaria as atualizações
    })
    .catch(error => {
      console.error('[Service Worker] Erro na atualização:', error);
    });
}

// Offline fallback
const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Gala Juvenil 2025</title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #0D1B2A 0%, #1A237E 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        .offline-container {
            max-width: 500px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 2px solid #D4AF37;
        }
        h1 {
            font-family: 'Cinzel', serif;
            color: #D4AF37;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .icon {
            font-size: 4rem;
            color: #D4AF37;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="icon">📡</div>
        <h1>Você está offline</h1>
        <p>Algumas funcionalidades podem estar limitadas devido à falta de conexão com a internet.</p>
        <p>Você ainda pode visualizar convites gerados anteriormente.</p>
        <p><small>A aplicação tentará reconectar automaticamente.</small></p>
    </div>
</body>
</html>
`;

// Cache da página offline na instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        const offlineResponse = new Response(OFFLINE_HTML, {
          headers: { 'Content-Type': 'text/html' }
        });
        return cache.put(OFFLINE_URL, offlineResponse);
      })
  );
});