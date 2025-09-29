
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');
const firebaseConfig = {
  apiKey: "AIzaSyDN1HyihEn13LEcNKSyIGFPXzshwdf4sEI",
  authDomain: "push-notification-b5bd7.firebaseapp.com",
  projectId: "push-notification-b5bd7",
  storageBucket: "push-notification-b5bd7.firebasestorage.app",
  messagingSenderId: "436246062268",
  appId: "1:436246062268:web:855c99733db2e28a895cb9"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optional: path to your notification icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});