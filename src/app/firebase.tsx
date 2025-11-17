import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyD5-02PRSSiVcWc1SUe2hss_yGfR8xGiT4",
  authDomain: "portfolio-website-cfe3d.firebaseapp.com",
  databaseURL: "https://portfolio-website-cfe3d-default-rtdb.firebaseio.com",
  projectId: "portfolio-website-cfe3d",
  storageBucket: "portfolio-website-cfe3d.firebasestorage.app",
  messagingSenderId: "892288973919",
  appId: "1:892288973919:web:36c003a4c31c246efaafea"
};

// 🔥 Prevent duplicate initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 🚀 Export shared instances
export const realtimeDB = getDatabase(app);
export const storage = getStorage(app);

// ⭐ Add Auth
export const auth = getAuth(app);

// ⭐ Google provider (you'll use this when logging in)
export const provider = new GoogleAuthProvider();
