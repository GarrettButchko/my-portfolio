"use client";

import { VStack, HStack, Spacer, Text } from "../Components/Components";
import React, { useState, useEffect } from "react";
import Search from "../../../public/svg/search.svg";
import Arrow from "../../../public/svg/arrow.svg";
import Plus from "../../../public/svg/plus.svg";
import Lock from "../../../public/svg/lock.svg";
import { Post } from "@/app/Types/Post";
import { Project } from "@/app/Types/Project";
import { PostView, PostViewPlaceHolder } from "@/app/MainViews/NewsSection";
import BlurOverlay from "@/app/Components/BlurOverlay";
import Image from "next/image";


export default function AdminPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortFirst, setSortFirst] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [authorized, setAuthorized] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [show, setShow] = useState(false);

    const SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY; // in .env.local

    const handleUnlock = () => {
        if (inputKey === SECRET_KEY) {
            setAuthorized(true);
        } else {
            alert("Invalid key!");
        }
    };

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

    // ✅ Fetch projects from API and cache in localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem("projects");
        if (cached) {
            setProjects(JSON.parse(cached));
            setLoading(false);
        }

        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => {
                const cachedData = cached ? JSON.parse(cached) : null;
                if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
                    setProjects(data);
                    localStorage.setItem("projects", JSON.stringify(data));
                }
            })
            .catch((err) => console.error("Error loading projects:", err))
            .finally(() => setLoading(false));
    }, []);

    const filteredPosts = posts
        .filter((p) => {
            const matchesSearch =
                query === "" ||
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.subtitle.toLowerCase().includes(query.toLowerCase()) || Object.keys(p.tags).includes(query.toLowerCase());

            return matchesSearch;
        })
        .sort((a, b) => {
            return sortFirst
                ? new Date(b.publish).getTime() - new Date(a.publish).getTime()
                : new Date(a.publish).getTime() - new Date(b.publish).getTime();
        });

    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <VStack className="justify-center items-center bg-foreground rounded-[25px] py-6 px-4 text-sub1">
                    <h1 className="text-2xl font-bold text-sub2 mb-4">Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Enter secret key"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        className="bg-sub2/20 px-4 py-2 rounded-[19px] mb-2 text-sub3"
                    />
                    <button
                        onClick={handleUnlock}
                        className="px-6 py-2 bg-accent hover:brightness-75 active:scale-95 text-white rounded-[19px] transition-all ease-in-out duration-300 cursor-pointer"
                    >
                        <HStack>
                            <Lock className="h-6" />
                            <p>Unlock</p>
                        </HStack>
                    </button>
                </VStack>
            </div>
        );
    }

    return (

        <div>


            <VStack className="mt-20 mb-20 justify-center items-center w-full" spacing={15}>
                {/* 🔍 Search + Sort Controls */}
                <div className="flex flex-row" style={{ gap: "8px" }}>
                    <HStack className="flex-1 min-h-9 bg-foreground rounded-[30px] justify-start items-center px-5">
                        <Search className="md:h-6 md:w-6 sm:h-5 sm:w-5 h-4 w-4 text-sub2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                            }}
                            className="ml-2 text-sub2 md:text-[20px] sm:text-[18px] text-[15px] bg-transparent outline-none w-full md:min-w-100 sm:min-w-75 min-w-40"
                        />
                    </HStack>

                    <button
                        title="Sort posts by newest or oldest"
                        type="button"
                        onClick={() => {
                            setSortFirst(!sortFirst);
                        }}
                        className="
                        bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-2
                        hover:bg-oppbackground/5
                        active:scale-95 
                        transition-all
                        ease-in-out
                        duration-300
                        cursor-pointer
                    ">
                        <Arrow
                            className={`text-accent md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6
                        transition-transform
                        ease-in-out
                        duration-300
                        ${sortFirst ? "rotate-0" : "rotate-180"}
                    `} />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                        }}
                        className="
                        bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-2
                        hover:bg-oppbackground/5
                        active:scale-95 
                        transition-all
                        ease-in-out
                        duration-300
                        cursor-pointer
                    ">
                        <Plus className="text-accent md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6" />
                    </button>
                </div>

                {/* 📰 Post List */}
                <VStack className="mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px] p-6 justify-center items-center" spacing={45}>

                    {loading ? (
                        <>
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                        </>
                    ) : filteredPosts && filteredPosts.length > 0 ? (
                        <>
                            {filteredPosts.map((post, i) => (
                                <PostView key={post.title} post={post} index={i} />
                            ))}
                        </>
                    ) : (
                        <>
                            <p className="text-sub2 py-6">No posts yet...</p>
                        </>
                    )}
                </VStack>
            </VStack>

            <VStack className="my-20 md:text-[15px] sm:text-[15px] text-[10px]">
                <p className="text-sub2">
                    © {new Date().getFullYear()} Garrett Butchko. All rights reserved.
                </p>
            </VStack>


            <BlurOverlay show={show} onClose={() => setShow(false)}>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-3">Overlay Content</h2>
                    <p className="text-gray-600 dark:text-gray-300">This is over the blurred screen.</p>
                    <button
                        onClick={() => setShow(false)}
                        className="mt-4 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </BlurOverlay>
        </div >
        
    );
}

