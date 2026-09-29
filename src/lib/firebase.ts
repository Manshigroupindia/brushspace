import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBI2RQPmj_N4Fo9YHuV2aPu0mLXj6jK7KU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "brushspace-17bf4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "brushspace-17bf4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "brushspace-17bf4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1046513833436",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1046513833436:web:6b6d0b135f1ae492836b19",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-01TCS5LLC0"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
