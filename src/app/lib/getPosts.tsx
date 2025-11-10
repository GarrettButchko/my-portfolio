import "server-only";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { Post } from "@/app/Types/Post";

// ✅ Firebase config (from environment)
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: "portfolio-website-cfe3d.firebaseapp.com",
    databaseURL: "https://portfolio-website-cfe3d-default-rtdb.firebaseio.com",
    projectId: "portfolio-website-cfe3d",
    storageBucket: "portfolio-website-cfe3d.firebasestorage.app",
    messagingSenderId: process.env.MESSENGINGSENDERID,
    appId: process.env.APPID,
};

// ✅ Initialize app safely (no duplicate apps in dev)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔁 In-memory cache
let cache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
let postsPromise: Promise<Post[]> | null = null;

// ✅ Fetch all posts from Realtime Database
export async function getPosts(): Promise<Post[]> {
    // Return cached version if recent
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
        console.log("🪣 Using cached Realtime DB posts");
        return cache;
    }

    // Return shared promise if fetch ongoing
    if (postsPromise) {
        console.log("⏳ Returning existing getPosts() promise");
        return postsPromise;
    }

    postsPromise = (async () => {
        console.log("🔥 Fetching posts from Realtime Database...");

        try {
            const snapshot = await get(ref(db, "posts"));

            if (!snapshot.exists()) {
                console.warn("⚠️ No posts found in Realtime Database");
                return [];
            }

            // Convert object map -> array
            const data = snapshot.val();
            const posts: Post[] = Object.values(data).map((item: any) => ({
                ...item,
                publish: item.publish?.toDate ? item.publish.toDate().toISOString() : item.publish,
            }));

            // Cache result
            cache = posts;
            cacheTime = Date.now();
            postsPromise = null;

            return posts;
        } catch (err) {
            console.error("❌ Error fetching posts:", err);
            postsPromise = null;
            return cache || [];
        }
    })();

    return postsPromise;
}
