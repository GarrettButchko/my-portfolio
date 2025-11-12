"use client";

import { useParams } from 'next/navigation';
import { VStack, HStack, Text } from '@/app/Components/components';
import React, { useState, useEffect, useRef } from "react";
import { Post } from "@/app/Types/Post";
import { slugify } from '@/app/lib/slugify';
import Image from "next/image";
import Share from "../../../../public/svg/share.svg";
import News from "../../../../public/svg/news.svg";
import BlurOverlay from "@/app/Components/blurOverlay";
import { useRouter } from "next/navigation";

export default function BlogPost() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [show, setShow] = useState(false);
    const popUpView = useRef<React.ReactNode>(
        <div className="text-textColor text-center font-bold">
            Nothing Here Yet :)...
        </div>
    );

    const [post, setPost] = useState<Post>();

    // ✅ Fetch posts from API and cache in localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem("posts");
        if (cached) {
            const cachedPosts = JSON.parse(cached);
            setPosts(cachedPosts);
            setPost(cachedPosts.find((p: Post) => slugify(p.title) === slug));
            setLoading(false);
        }



        fetch("/api/posts")
            .then(res => res.json())
            .then(data => {
                const cachedData = cached ? JSON.parse(cached) : null;
                if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
                    setPosts(data);
                    const foundPost = data.find((p: Post) => slugify(p.title) === slug);
                    setPost(foundPost);
                    localStorage.setItem("posts", JSON.stringify(data));
                }
            })

    }, [slug]);



    // Assuming 'slug' comes from useParams() or query string

    if (!post) {
        return (
            <div className="flex items-center justify-center w-full h-screen text-center">
                <p className="text-textColor text-lg">
                    Error: no post found
                </p>
            </div>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    url: window.location.href,
                });
                console.log("Shared successfully!");
            } catch (err: any) {
                // User canceled is normal, don't treat as error
                if (err.name !== "AbortError") {
                    console.error("Error sharing:", err);
                } else {
                    console.log("Share canceled by user");
                }
            }
        } else {
            // Fallback for desktop or unsupported browsers
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };




    return (
        <main className="flex justify-center items-top min-h-screen w-full bg-background px-3">
            <VStack className="w-full max-w-4xl mt-20" spacing={15}>
                {/* Top row with HStacks */}
                <div className="flex flex-row justify-center" style={{ gap: "8px" }}>

                    <button
                        title="Sort posts by newest or oldest"
                        type="button"
                        onClick={() => {
                            router.push("/?start-section=News")
                        }}
                        className="
                        bg-foreground rounded-full flex justify-center items-center
                        hover:bg-oppbackground/5
                        active:scale-95 
                        transition-all
                        ease-in-out
                        duration-300
                        cursor-pointer
                    ">
                        <HStack className="text-accent md:text-[18px] sm:text-[16px] text-[14px] justify-center items-center py-2 px-5" spacing={5}>
                            <News className="md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6
                            transition-transform
                            ease-in-out
                            duration-300
                            "/>
                            <p className="pr-2">
                                Next
                            </p>
                        </HStack>
                    </button>

                    <button
                        title="Sort posts by newest or oldest"
                        type="button"
                        onClick={() => {
                            handleShare();
                        }}
                        className="
                        bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-3
                        hover:bg-oppbackground/5
                        active:scale-95 
                        transition-all
                        ease-in-out
                        duration-300
                        cursor-pointer
                    ">
                        <Share
                            className="text-accent md:h-5 sm:h-4 h-3 md:w-5 sm:w-4 w-3
                                transition-transform
                                ease-in-out
                                duration-300
                            "
                        />
                    </button>
                </div>

                {/* Main content */}
                <VStack className="w-full bg-foreground rounded-[30px] p-6" spacing={45}>
                    {/* Your content goes here */}
                </VStack>
            </VStack>

            <BlurOverlay show={show} onClose={() => setShow(false)}>
                {popUpView.current}
            </BlurOverlay>
        </main>
    );
}