const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/index.html", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 푸시 메시지 수신
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "logo192.png",
    badge: "logo192.png",
    data: "/ingredients",
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "알림", options)
  );
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
});

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
});

// 알림 클릭 이벤트 처리
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received:", event);
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});

// 새로 배포했을 때 캐쉬 삭제
// self.addEventListener('install', (event) => {
//   console.log('[Service Worker] Installing new service worker...');

//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           // 이전 캐시 제거
//           if (cacheName !== 'reciFIT-cache') {
//             console.log('[Service Worker] Removing old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });
// self.addEventListener('activate', (event) => {
//   console.log('[Service Worker] Activating new service worker...');
//   return self.clients.claim();
// });