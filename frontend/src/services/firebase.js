import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCD4gYLJeZR7BaOmYWvFIxoegyTHRXBOrY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dromoney-1d6df.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dromoney-1d6df",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dromoney-1d6df.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "277091263571",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:277091263571:web:a9e8bbca80f91039ac52a6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0WBBZC92P2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, analytics, auth, db, messaging, getToken, onMessage };
