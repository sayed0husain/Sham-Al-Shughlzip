import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SITES_API_KEY,
  authDomain: import.meta.env.VITE_SITES_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_SITES_DATABASE_URL,
  projectId: import.meta.env.VITE_SITES_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SITES_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SITES_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_SITES_APP_ID,
  measurementId: import.meta.env.VITE_SITES_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

export const ADMIN_EMAIL = import.meta.env.VITE_SITES_ADMIN_EMAIL ?? "sayedhusain133@gmail.com";
