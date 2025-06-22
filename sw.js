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
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('缓存静态资源...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('静态资源缓存完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('缓存静态资源失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CDN_CACHE) {
              console.log('删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker 激活完成');
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

  event.respondWith(
    // 对于CDN资源，使用智能缓存策略
    CDN_ASSETS.includes(request.url) ? 
      handleCDNRequest(request)
    :
    // 对于静态资源，优先从缓存获取
    caches.match(request)
      .then(response => {
        // 如果缓存中有响应，返回缓存的响应
        if (response) {
          return response;
        }

        // 对于其他请求，尝试网络请求
        return fetch(request)
          .then(response => {
            // 只缓存成功的响应
            if (response.ok && response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(error => {
            console.error('网络请求失败:', error);
            
            // 对于HTML请求，返回缓存的index.html
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('index.html');
            }
            
            // 对于其他请求，返回null
            return null;
          });
      })
  );
});

// 处理CDN请求的智能缓存策略
async function handleCDNRequest(request) {
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
      console.log('CDN资源已更新:', request.url);
      return networkResponse;
    }
  } catch (error) {
    console.log('CDN网络请求失败，尝试使用缓存:', request.url);
  }
  
  // 网络请求失败，尝试从缓存获取
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // 检查缓存是否过期
    const cacheTime = cachedResponse.headers.get('sw-cache-time');
    if (cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_EXPIRY) {
      console.log('使用有效的CDN缓存:', request.url);
      return cachedResponse;
    } else {
      console.log('CDN缓存已过期:', request.url);
      // 删除过期缓存
      const cache = await caches.open(CDN_CACHE);
      await cache.delete(request);
    }
  }
  
  // 没有有效缓存，返回null让页面使用本地fallback
  return null;
}

// 后台同步 - 用于数据同步
self.addEventListener('sync', event => {
  console.log('后台同步事件:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 这里可以添加数据同步逻辑
      console.log('执行后台同步...')
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
  console.log('开始清理过期缓存...');
  
  try {
    const cache = await caches.open(CDN_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const cacheTime = response.headers.get('sw-cache-time');
        if (cacheTime && (Date.now() - parseInt(cacheTime)) >= CACHE_EXPIRY) {
          await cache.delete(request);
          console.log('删除过期缓存:', request.url);
        }
      }
    }
    
    console.log('缓存清理完成');
  } catch (error) {
    console.error('缓存清理失败:', error);
  }
}

// 推送通知
self.addEventListener('push', event => {
  console.log('收到推送通知');
  
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
  console.log('通知被点击:', event.action);
  
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
}); 