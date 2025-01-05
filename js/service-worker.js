const CACHE_NAME = 'v1';
const CACHE_URLS = [
  'https://cdn.dribbble.com/users/829077/screenshots/6243210/everything-30_.gif'
];

// 安装 Service Worker 并缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker installed.');
      return cache.addAll(CACHE_URLS);
    })
  );
});

// 拦截请求并提供缓存的资源
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 如果缓存中有对应资源，就返回缓存资源
      if (cachedResponse) {
        return cachedResponse;
      }
      // 否则正常请求
      return fetch(event.request);
    })
  );
});

// 清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // 需要保留的缓存名称
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除不在缓存白名单中的缓存
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  console.log('Service Worker activated and old caches cleaned.');
});