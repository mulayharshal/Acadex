import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let messaging = null;
let registration = null;

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();

  if (!supported) {
    console.warn("Firebase Messaging is not supported.");
    return null;
  }

  if (!registration) {
    registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    await navigator.serviceWorker.ready;

    console.log("Service Worker Registered:", registration.scope);
  }

  if (!messaging) {
    messaging = getMessaging(app);
  }

  return messaging;
};

export const getServiceWorkerRegistration = () => registration;

export default app;