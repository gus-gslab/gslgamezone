// Service Worker - NO CACHE VERSION
// This service worker ensures users always get the latest version

// Install event - clear all caches
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install - clearing all caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Service Worker: Deleting cache', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker: All caches cleared');
      return self.skipWaiting();
    })
  );
});

// Activate event - clear all caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate - clearing all caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Service Worker: Deleting cache', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated - no caching');
      return self.clients.claim();
    })
  );
});

// Fetch event - ALWAYS fetch from network, never cache
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetch - always from network', event.request.url);
  
  // Always fetch from network, never use cache
  event.respondWith(
    fetch(event.request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    .catch((error) => {
      console.log('Service Worker: Network fetch failed', error);
      // If network fails, return a basic response
      return new Response('Network error', { status: 503 });
    })
  );
});

// Force update when new version is available
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle updates - force reload
self.addEventListener('controllerchange', () => {
  console.log('Service Worker: Controller changed - reloading');
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'RELOAD' });
    });
  });
});
