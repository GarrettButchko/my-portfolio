import "server-only";
import { realtimeDB } from "@/app/firebase";
import { ref, get } from "firebase/database";
import { Post, RawPost } from "@/app/types";
import { normalizePost } from "@/app/lib/normalizePost";

// 🔁 In-memory cache
let cache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
let postsPromise: Promise<Post[]> | null = null;

// ✅ Fetch all posts from Realtime Database
export async function getPosts(): Promise<Post[]> {
    // Use cached version if fresh
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
        console.log("🪣 Using cached Realtime DB posts");
        return cache;
    }

    // If another request already started → share it
    if (postsPromise) {
        console.log("⏳ Returning existing getPosts() promise");
        return postsPromise;
    }

    postsPromise = (async () => {
        console.log("🔥 Fetching posts from Realtime Database...");

        try {
            const snapshot = await get(ref(realtimeDB, "posts"));

            if (!snapshot.exists()) {
                console.warn("⚠️ No posts found in Realtime Database");
                return [];
            }

            const data = snapshot.val();

            // Convert object → array
            const posts: Post[] = (Object.values(data) as RawPost[]).map(normalizePost);

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
