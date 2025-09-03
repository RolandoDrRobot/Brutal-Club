// 🚀 MOBILE OPTIMIZATION: Enhanced Service Worker for better caching
const CACHE_NAME = 'fightclub-v1.2.0';
const STATIC_CACHE = 'fightclub-static-v1.2.0';
const DYNAMIC_CACHE = 'fightclub-dynamic-v1.2.0';

// 🎯 Critical assets that should be cached immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/assets/optimized/coin.webp',
  '/src/assets/optimized/home.webp',
  '/src/assets/optimized/statCoin.webp',
  '/src/assets/optimized/punch.webp',
  '/src/assets/optimized/kick.webp',
  '/src/assets/optimized/combo.webp',
  '/src/assets/optimized/cover.webp',
  '/music/punch.mp3'
];

// 🎨 Static assets for UI
const STATIC_ASSETS = [
  '/src/assets/optimized/dance.webp',
  '/src/assets/mainbutton.jpeg',
  '/src/assets/optimized/button1.webp',
  '/src/assets/optimized/button2.webp',
  '/src/assets/optimized/button3.webp',
  '/src/assets/optimized/button4.webp',
  '/src/assets/optimized/music.webp',
  '/src/assets/optimized/pack.webp',
  '/src/assets/optimized/coverbg.webp'
];

// 📦 3D Models (cached on demand)
const MODEL_ASSETS = [
  '/models/pete.glb',
  '/models/Tyler.glb',
  '/models/Bob.glb',
  '/models/Chuck.glb',
  '/models/Earl.glb',
  '/models/Wayne.glb',
  '/models/Vince.glb'
];

// 🎵 Audio assets (cached on demand)
const AUDIO_ASSETS = [
  '/music/crowd.mp3',
  '/music/button.mp3'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {

  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {

        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {

        return self.skipWaiting();
      })
      .catch((error) => {

      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {

  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE) {

              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {

        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // 🚀 MOBILE OPTIMIZATION: Different caching strategies for different asset types
  if (url.pathname.endsWith('.glb') || url.pathname.endsWith('.gltf')) {
    // 3D Models: Cache first, then network
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
  } else if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav')) {
    // Audio: Cache first, then network
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    // Images: Cache first, then network
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    // JS/CSS: Network first, then cache
    event.respondWith(networkFirst(request, STATIC_CACHE));
  } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    // HTML: Network first, then cache
    event.respondWith(networkFirst(request, CACHE_NAME));
  } else {
    // Default: Network first, then cache
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// 🚀 MOBILE OPTIMIZATION: Cache first strategy for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {

    return new Response('Offline content not available', { status: 503 });
  }
}

// 🚀 MOBILE OPTIMIZATION: Network first strategy for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline content not available', { status: 503 });
  }
}

// 🚀 MOBILE OPTIMIZATION: Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {

    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Perform any background tasks here

  } catch (error) {

  }
}

// 🚀 MOBILE OPTIMIZATION: Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update available!',
      icon: '/src/assets/mainbutton.jpeg',
      badge: '/src/assets/punch.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'FightClub', options)
    );
  }
});

// 🚀 MOBILE OPTIMIZATION: Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

 