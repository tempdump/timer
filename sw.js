// Service Worker for Timer & Klocka
// Implements offline-first caching strategy

const CACHE_NAME = 'timer-v1';
const RUNTIME_CACHE = 'timer-runtime-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './timer.js',
  './clock.js',
  './themes.js',
  './sounds.js',
  './translations.js',
  './enhancements.js',
  './manifest.json',
  // External resources
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
  'https://cdn.jsdelivr.net/npm/@pqina/flip@1.7.2/dist/flip.min.css',
  'https://cdn.jsdelivr.net/npm/@pqina/flip@1.7.2/dist/flip.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - offline-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            return cached;
          }

          return fetch(request)
            .then((response) => {
              // Cache the fetched response
              return caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response.clone());
                return response;
              });
            });
        })
        .catch(() => {
          // Return offline page or fallback
          return new Response('Offline - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        })
    );
    return;
  }

  // Network-first for other requests (with cache fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Timer färdig!',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'timer-notification',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'Visa' },
      { action: 'dismiss', title: 'Stäng' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Timer & Klocka', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync (for future use)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
    );
  }
});
