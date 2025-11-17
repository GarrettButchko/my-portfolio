import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: "portfolio-website-cfe3d.firebaseapp.com",
    databaseURL: "https://portfolio-website-cfe3d-default-rtdb.firebaseio.com",
    projectId: "portfolio-website-cfe3d",
    storageBucket: "portfolio-website-cfe3d.firebasestorage.app",
    messagingSenderId: process.env.MESSENGINGSENDERID,
    appId: process.env.APPID,
};

// 🔥 Prevent duplicate initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 🚀 Export shared instances
export const realtimeDB = getDatabase(app);
export const storage = getStorage(app);
