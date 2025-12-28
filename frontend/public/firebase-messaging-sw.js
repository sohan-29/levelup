importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

let firebaseApp = null;
let messaging = null;

// Listen for Firebase config from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    console.log('Received Firebase config in service worker:', event.data.config);

    if (!firebaseApp) {
      try {
        firebaseApp = firebase.initializeApp(event.data.config);
        messaging = firebase.messaging();
        console.log('Firebase initialized in service worker');

        // Set up background message handler after config is received
        messaging.onBackgroundMessage((payload) => {
          console.log("Received background message:", payload);

          const notificationTitle = payload.notification?.title || 'Notification';
          const notificationOptions = {
            body: payload.notification?.body || 'You have a new message',
            icon: "/vite.svg",
            badge: "/vite.svg",
            tag: payload.data?.tag || "default",
            requireInteraction: true,
            silent: false,
          };

          self.registration.showNotification(notificationTitle, notificationOptions);
        });

        console.log('Background message handler set up');
      } catch (error) {
        console.error('Error initializing Firebase in service worker:', error);
      }
    }
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.");

  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = "http://localhost:5174/dashboard"; // Full URL for development

      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/dashboard') && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
