import { getToken, onMessage } from "firebase/messaging";
import {
  getFirebaseMessaging,
  getServiceWorkerRegistration,
} from "./firebase";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return null;
    }

    // Already granted
    if (Notification.permission === "granted") {
      const messaging = await getFirebaseMessaging();

      if (!messaging) return null;

      const registration = getServiceWorkerRegistration();

      console.log("Using Service Worker:", registration?.scope);

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      }

      return null;
    }

    // Already denied
    if (Notification.permission === "denied") {
      console.log("Notification permission denied.");
      return null;
    }

    // Ask permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) return null;

    const registration = getServiceWorkerRegistration();

    console.log("Using Service Worker:", registration?.scope);

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Listen for notifications while app is open
 */
export const listenForMessages = async (callback) => {
  try {
    const messaging = await getFirebaseMessaging();

    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log("Foreground Notification:", payload);

      if (callback) {
        callback(payload);
      }
    });
  } catch (error) {
    console.error("Foreground notification error:", error);
  }
};