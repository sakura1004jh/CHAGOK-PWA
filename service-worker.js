const CACHE_NAME = 'chagok-pwa-v1';

self.addEventListener('install', (event) => {
  console.log('앱 설치 중...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('앱 활성화됨');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response('오프라인 상태입니다.');
          });
      })
  );
});