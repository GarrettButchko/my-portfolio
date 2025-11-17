import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../firebase";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ⚡ Use the correct bucket for CORS-safe URLs
const storage = getStorage(app, "gs://portfolio-website-cfe3d.firebasestorage.app");

export async function downloadImageAsFile(
  storagePath: string | null,
  filename: string
): Promise<File | null> {
  if (!storagePath) return null;

  try {
    const fileRef = ref(storage, storagePath);
    const url = await getDownloadURL(fileRef); // always get correct bucket URL

    const res = await fetch(url);
    if (!res.ok) return null;

    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (err) {
    console.error("Download failed:", err);
    return null;
  }
}

