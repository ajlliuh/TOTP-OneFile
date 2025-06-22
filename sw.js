const CACHE_NAME = 'totp-manager-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const CDN_CACHE = 'cdn-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'libs/bootstrap.min.css',
  'libs/bootstrap.bundle.min.js',
  'libs/bootstrap-icons.css',
  'libs/vue.global.prod.js',
  'libs/crypto-js.min.js',
  'libs/jsQR.js',
  'libs/kjua.min.js',
  'libs/fonts/bootstrap-icons.woff',
  'libs/fonts/bootstrap-icons.woff2'
];

// 需要缓存的CDN资源
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js',
  'https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js',
  'https://cdn.jsdelivr.net/npm/kjua@0.1.1/dist/kjua.min.js'
];

// 缓存过期时间（7天）
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

// 安装事件 - 缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('缓存静态资源失败:', error);
        // 即使缓存失败也要继续安装
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CDN_CACHE) {
              return caches.delete(cacheName);
            }
            return Promise.resolve(); // 确保返回Promise
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker 激活失败:', error);
        // 即使清理失败也要继续激活
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过chrome-extension和data URL
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:') {
    return;
  }

  // 在本地文件环境中，跳过CDN资源的处理
  if (self.location.protocol === 'file:' && CDN_ASSETS.includes(request.url)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // 对于CDN资源，使用智能缓存策略
        if (CDN_ASSETS.includes(request.url)) {
          const response = await handleCDNRequest(request);
          if (response) {
            return response;
          } else {
            // CDN处理失败，让页面使用本地fallback
            return new Response('CDN Unavailable', { status: 404 });
          }
        }

        // 对于静态资源，优先从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 对于其他请求，尝试网络请求
        try {
          const response = await fetch(request);
          if (response.ok) {
            // 只缓存成功的响应
            const cache = await caches.open(STATIC_CACHE);
            await cache.put(request, response.clone());
          }
          return response;
        } catch (fetchError) {
          // 网络请求失败，返回错误响应
          return new Response('Network Error', { status: 503 });
        }
      } catch (error) {
        console.error('Service Worker处理请求失败:', request.url, error);
        // 发生异常，尝试直接网络请求
        try {
          return await fetch(request);
        } catch (fetchError) {
          console.error('最终网络请求也失败:', request.url, fetchError);
          return new Response('Service Worker Error', { status: 500 });
        }
      }
    })()
  );
});

// 处理CDN请求的智能缓存策略
async function handleCDNRequest(request) {
  // 检查是否在本地文件环境中
  if (self.location.protocol === 'file:') {
    return null; // 让页面使用本地fallback
  }
  
  try {
    // 首先尝试从网络获取最新版本
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 网络请求成功，更新缓存
      const responseClone = networkResponse.clone();
      const cache = await caches.open(CDN_CACHE);
      
      // 添加缓存时间戳
      const headers = new Headers(networkResponse.headers);
      headers.set('sw-cache-time', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
      return networkResponse;
    } else {
      // 网络请求失败，尝试从缓存获取
      const cache = await caches.open(CDN_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      } else {
        // 缓存也没有，返回null让页面使用本地fallback
        return null;
      }
    }
  } catch (error) {
    // 网络异常，尝试从缓存获取
    try {
      const cache = await caches.open(CDN_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      } else {
        // 缓存也没有，静默失败，让页面使用本地fallback
        return null;
      }
    } catch (cacheError) {
      console.error('缓存访问失败:', cacheError);
      return null;
    }
  }
}

// 后台同步 - 用于数据同步
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 这里可以添加数据同步逻辑
      Promise.resolve()
    );
  }
  
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      cleanupExpiredCache()
    );
  }
});

// 清理过期缓存
async function cleanupExpiredCache() {
  try {
    const cache = await caches.open(CDN_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const cacheTime = response.headers.get('sw-cache-time');
        if (cacheTime && (Date.now() - parseInt(cacheTime)) >= CACHE_EXPIRY) {
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.error('缓存清理失败:', error);
  }
}

// 推送通知
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'TOTP令牌管理器通知',
    icon: 'icons/icon.svg',
    badge: 'icons/icon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: 'icons/icon.svg'
      },
      {
        action: 'close',
        title: '关闭',
        icon: 'icons/icon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TOTP令牌管理器', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// 错误处理
self.addEventListener('error', event => {
  console.error('Service Worker 错误:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker 未处理的Promise拒绝:', event.reason);
  // 防止Promise拒绝导致Service Worker崩溃
  event.preventDefault();
}); 