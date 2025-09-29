import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDN1HyihEn13LEcNKSyIGFPXzshwdf4sEI",
    authDomain: "push-notification-b5bd7.firebaseapp.com",
    projectId: "push-notification-b5bd7",
    storageBucket: "push-notification-b5bd7.firebasestorage.app",
    messagingSenderId: "436246062268",
    appId: "1:436246062268:web:855c99733db2e28a895cb9"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'BBb879_GnQ207xY87r01JT9-W23dXa2mYYcnNvIG5-dhB-MdC3rtLoDoILwEcv_SEFB_uNdjpcCKFAZcZCUdp_I' });
    if (currentToken) {
      console.log('FCM Registration Token:', currentToken);
      // Send the token to your server to store and use for sending notifications
    } else {
      console.log('No registration token available. Requesting permission to generate one.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
});