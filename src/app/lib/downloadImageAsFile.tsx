import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// ✅ Initialize Firebase safely (no duplicates in dev)
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "portfolio-website-cfe3d.firebaseapp.com",
  databaseURL: "https://portfolio-website-cfe3d-default-rtdb.firebaseio.com",
  projectId: "portfolio-website-cfe3d",
  storageBucket: "portfolio-website-cfe3d.appspot.com",
  messagingSenderId: process.env.MESSENGINGSENDERID,
  appId: process.env.APPID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function downloadImageAsFile(
  storagePathOrUrl: string | null,
  filename: string
): Promise<File | null> {
  if (!storagePathOrUrl || storagePathOrUrl.trim() === "") return null;

  try {
    // Try to treat it as a Firebase Storage path first
    let url: string;
    try {
      const fileRef = ref(storage, storagePathOrUrl);
      url = await getDownloadURL(fileRef);
    } catch {
      // If Storage fetch fails, fallback to original URL
      url = storagePathOrUrl;
    }

    const res = await fetch(url);
    if (!res.ok) return null;

    const blob = await res.blob();
    if (!blob || blob.size === 0) return null;

    return new File([blob], filename, { type: blob.type });
  } catch (err) {
    console.error("Download failed:", err);
    return null;
  }
}
