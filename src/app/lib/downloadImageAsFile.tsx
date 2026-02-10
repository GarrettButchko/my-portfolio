import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../firebase";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://portfolio-website-cfe3d.firebasestorage.app");

export async function downloadImageAsFile(
  storagePathOrUrl: string | null,
  filename: string
): Promise<File | null> {
  if (!storagePathOrUrl) return null;

  try {
    // If it's already a full URL, fetch it directly
    if (/^https?:\/\//.test(storagePathOrUrl)) {
      const res = await fetch(storagePathOrUrl);
      if (!res.ok) return null;
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type });
    }

    // Otherwise treat it as a storage path and resolve the download URL
    const fileRef = ref(storage, storagePathOrUrl);
    const url = await getDownloadURL(fileRef);
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (err) {
    console.error("Download failed:", err);
    return null;
  }
}

