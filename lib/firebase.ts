// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAovQ4gbxoS3hqGnDAFAr0PKHvcwWAuZD4",
  authDomain: "sportev-prod.firebaseapp.com",
  projectId: "sportev-prod",
  storageBucket: "sportev-prod.firebasestorage.app",
  messagingSenderId: "225441480566",
  appId: "1:225441480566:web:7fff7ae72b8515e3654457",
  measurementId: "G-E4VNDY2TWK"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, analytics }; 