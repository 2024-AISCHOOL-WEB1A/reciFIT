const CACHE_NAME = "recifit-pwa-cache-v1.01";
const urlsToCache = ["/", "/index.html", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

// 네트워크 정보도 캐싱하도록 변경
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return (
//         response || fetch(event.request).then((response) => {
//           return caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, response.clone());
//             return response;
//           });
//         })
//       );
//     })
//   );
// });

// 네트워크 정보를 백그라운드에서 캐싱하도록 변경 (캐싱된 내용이 먼저 보여지고, 차후 갱신 때 변경된 내용이 보여짐)
// self.addEventListener("fetch", (event) => {
//   // GET 요청이 아닌 경우 캐싱 처리하지 않음
//   if (event.request.method !== "GET") {
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       const fetchPromise = fetch(event.request).then((networkResponse) => {
//         // 최신 데이터를 가져오면 캐시 갱신
//         return caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse;
//         });
//       });
//       // 캐시된 파일을 반환하고 네트워크 요청은 백그라운드에서 처리
//       return cachedResponse || fetchPromise;
//     })
//   );
// });

// API 주소에서는 캐싱하지 않도록 변경
self.addEventListener("fetch", (event) => {
  // GET 요청이 아닌 경우 캐싱 처리하지 않음
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.url.includes("/api/")) {
    // API 요청에 Network First 적용
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // 정적 파일에 Cache First 적용
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
  }
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

// 설치
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting(); // 설치된 서비스 워커를 즉시 활성화
});

// 활성화
// self.addEventListener("activate", (event) => {
//   console.log("Service Worker activating...");
// });

// 활성화 단계에서 이전 캐시 삭제
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // 활성화된 서비스 워커가 페이지를 제어하도록 설정
  return self.clients.claim();
});

// 알림 이벤트
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  // 커스터마이징도 가능
  // const data = event.data ? event.data.json() : {};
  // const title = data.title || "Default Title";
  // const body = data.body || "Default Body";
  // const url = data.url || "https://default-url.com";

  // event.waitUntil(
  //   self.registration.showNotification(title, {
  //     body: body,
  //     icon: "/icon.png",
  //     data: url,
  //     actions: [
  //       { action: "open", title: "Open" },
  //       { action: "dismiss", title: "Dismiss" },
  //     ],
  //     requireInteraction: true, // 사용자가 상호작용할 때까지 알림 유지
  //   })
  // );
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