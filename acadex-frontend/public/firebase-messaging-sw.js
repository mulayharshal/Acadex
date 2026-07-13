/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBllxOAAqkpKNdAon03uCGracd2cdxawWY",
  authDomain: "acadex-harshal.firebaseapp.com",
  projectId: "acadex-harshal",
  storageBucket: "acadex-harshal.firebasestorage.app",
  messagingSenderId: "505243487838",
  appId: "1:505243487838:web:3ebc91af7f67678cb96ecf",
});

const messaging = firebase.messaging();

/**
 * Handle notifications when the app is in the background
 */
messaging.onBackgroundMessage(async (payload) => {
  console.log("[firebase-messaging-sw.js] Background Message", payload);

  try {
    await self.registration.showNotification(payload.data.title || "Acadex", {
      body: payload.data.body || "",
      icon: payload.data.icon || "/acadex.jpeg",
      badge: payload.data.icon || "/acadex.jpeg",
      data: payload.data,
      tag: "acadex-notification",
      renotify: true,
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
});

/**
 * Handle notification click
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
