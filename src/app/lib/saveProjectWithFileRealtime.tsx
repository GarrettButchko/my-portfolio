import { get, ref as dbRef, set, update } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, getMetadata } from "firebase/storage";
import { realtimeDB, storage } from "@/app/firebase";
import { Post } from "@/app/types";
import { formatDate } from "./formatDate";

export default async function saveProjectWithFileRealtime({
    file,
    post,
}: {
    file: File | null;
    post: Post;
}) {

    var payload;

    const dateString = formatDate(post.publish)

    try {

        if (file) {
            // ---- 1. Handle STORAGE ----
            var fileRef;
            if (file.name.includes(`${post.id}_`)) {
                fileRef = storageRef(storage, file.name);
            } else {
                fileRef = storageRef(storage, `${post.id}_${file.name}`);
            }

            let downloadURL;

            try {
                await getMetadata(fileRef);
                downloadURL = await getDownloadURL(fileRef);
                console.log("File already exists — using existing URL");
            } catch (err) {
                console.log("Uploading new file:", file.name);
                await uploadBytes(fileRef, file);
                downloadURL = await getDownloadURL(fileRef);
            }

            payload = {
                ...post,
                publish: dateString,
                photo: downloadURL,
            };
        } else {
            payload = {
                ...post,
                publish: dateString,
                photo: "",
            };
        }

        // ---- 2. Prepare payload ----

        const postRef = dbRef(realtimeDB, `posts/${post.id}`);

        // ---- 3. Detect if this is new or update ----
        const existing = await get(postRef);
        const exists = existing.exists();

        if (exists) {
            console.log("Updating existing post:", post.id);
            await update(postRef, payload);
        } else {
            console.log("Creating new post:", post.id);
            await set(postRef, payload);
        }

        return {
            success: true,
            payload,
        };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
}
