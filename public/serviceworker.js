/* global clients */

const CACHE_NAME = "version-90";
const urlsToCache = [
  "index.html",
  "offline.html",
  "quizselection.js",
  "QuizResult.js",
  "App.js",
  "NavigationBar.js",
  "App.css",
  "index.css",
  "topBar.js",
  "ErrorBoundary.js",
  "ErrorFallbackUI.js",
  "FeedbackModal.js",
  "loadingspinner.js",
  "QuizChoice.js",
  "Sidebar.js",
  "SubjectChoice.js",
  "serviceworker.js",
  "manifest.json",
  "MainContent.js",
  "BottomNav.js",
  "Account.js",
  "Leaderboard.js",
];

const self = this;

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests using the "Cache First with Network Update" strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return event.respondWith(fetch(event.request)); // Respond with non-GET request directly
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      })
      .catch(() => {
        if (event.request.destination === "document") {
          return caches.match("offline.html");
        }
      })
  );
});

// Activate the SW
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        return clients.claim(); // Take control immediately
      })
      .then(() => {
        // Notify the client to reload the page or handle new version
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) =>
            client.postMessage({ type: "NEW_VERSION" })
          );
        });
      })
  );
});
