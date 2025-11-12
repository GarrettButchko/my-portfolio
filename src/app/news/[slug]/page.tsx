import { useParams } from 'next/navigation';
import { VStack, Text } from '@/app/Components/components';
import React, { useState, useEffect, useRef } from "react";
import { Post } from "@/app/Types/Post";
import { deslugify } from '@/app/lib/slugify';
import Image from "next/image";


export default function BlogPost() {
    const params = useParams();
    const slug = params.slug;
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    // ✅ Fetch posts from API and cache in localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem("posts");
        if (cached) {
            setPosts(JSON.parse(cached));
            setLoading(false);
        }

        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => {
                const cachedData = cached ? JSON.parse(cached) : null;
                if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
                    setPosts(data);
                    localStorage.setItem("posts", JSON.stringify(data));
                }
            })
            .catch((err) => console.error("Error loading posts:", err))
            .finally(() => setLoading(false));
    }, []);
    // Assuming 'slug' comes from useParams() or query string
    const post = posts.find(p => deslugify(p.title) === slug);
    if (!post) return <Text>Post not found</Text>;

    return (
        <VStack spacing={4} className="p-8">
            <Text className="text-3xl font-bold">{post.title}</Text>
            <Text>{post.body}</Text>
        </VStack>
    );
}