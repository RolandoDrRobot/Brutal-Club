// 🚀 MOBILE OPTIMIZATION: Enhanced Service Worker for better caching
const CACHE_NAME = 'fightclub-v1.2.0';
const STATIC_CACHE = 'fightclub-static-v1.2.0';
const DYNAMIC_CACHE = 'fightclub-dynamic-v1.2.0';

// 🎯 Critical assets that should be cached immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/assets/punch.png',
  '/src/assets/kick.png',
  '/src/assets/combo.png',
  '/src/assets/cover.png',
  '/music/punch.mp3'
];

// 🎨 Static assets for UI
const STATIC_ASSETS = [
  '/src/assets/dance.png',
  '/src/assets/mainbutton.jpeg',
  '/src/assets/button1.png',
  '/src/assets/button2.png',
  '/src/assets/button3.png',
  '/src/assets/button4.png',
  '/src/assets/music.png'
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
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching critical assets...');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('✅ Critical assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache critical assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
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
    console.warn('Cache first failed:', error);
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
    console.warn('Network first failed, trying cache:', error);
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
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Perform any background tasks here
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
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

console.log('🚀 Service Worker loaded successfully'); 