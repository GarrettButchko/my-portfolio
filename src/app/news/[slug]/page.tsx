"use client";

import { useParams } from 'next/navigation';
import Image from "next/image";
import { VStack, HStack, Divider } from '@/app/Components/Components';
import React, { useState, useEffect, useRef } from "react";
import { Post, Project } from "@/app/types";
import { slugify } from '@/app/lib/slugify';
import { ProjSection, ProjSectionPlaceHolder } from "@/app/Components/ProjectSection";
import Share from "../../../../public/svg/share.svg";
import News from "../../../../public/svg/news.svg";
import BlurOverlay from "@/app/Components/BlurOverlay";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PicView } from "../../Components/PicView";
import { formatDate } from '@/app/lib/formatDate';

export default function NewsPost() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [post, setPost] = useState<Post | undefined>();
    const year = (new Date().getFullYear());
    const [show, setShow] = useState(false);

    const popUpView = useRef<React.ReactNode>(
        <div className="text-textColor text-center font-bold">
            Nothing Here Yet :)...
        </div>
    );

     useEffect(() => {
        document.title = `News: ${slug} | GB Portfolio`;
    }, [slug]);

    // Fetch posts
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem("posts");
        if (cached) {
            const cachedPosts = JSON.parse(cached);
            setPost(cachedPosts.find((p: Post) => slugify(p.title) === slug));
            setLoading(false);
        }

        fetch("/api/posts")
            .then(res => res.json())
            .then(data => {
                const cachedData = cached ? JSON.parse(cached) : null;
                if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
                    const foundPost = data.find((p: Post) => slugify(p.title) === slug);
                    setPost(foundPost);
                    localStorage.setItem("posts", JSON.stringify(data));
                }
            })
            .finally(() => setLoading(false));

    }, [slug]);

    // Fetch projects
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

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen text-center">
                <p className="text-textColor text-lg">Loading...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center w-full h-screen text-center">
                <p className="text-textColor text-lg">Error: post not found</p>
            </div>
        );
    }

    // Filter projects safely
    const filteredProjects = projects.filter(
        (p) => post.relatedProjects?.includes(p.title)
    );

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    url: window.location.href,
                });
                console.log("Shared successfully!");
            } catch (err: unknown) {
                if (err instanceof Error) {
                    if (err.name !== "AbortError") console.error("Error sharing:", err);
                } else {
                    console.error("Unknown error:", err);
                }
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

   

    const formattedParagraphs = post.body
        .replace(/\/n/g, '\n')
        .split(/\n\s*\n/)
        .filter(p => p.trim().length > 0);

    return (
        <main className="flex justify-center items-top min-h-screen w-full bg-background md:px-6 sm:px-3 px-0">

            {/* Top buttons */}
            <HStack
                className="fixed top-5 z-50 left-1/2 -translate-x-1/2 w-fit outline outline-2 outline-sub1 rounded-[35px] p-[6px] bg-foreground/80 backdrop-blur-sm"
            >
                <div className="flex flex-row justify-center gap-2">

                    <motion.button
                        whileHover={{ scale: 1.06 }} transition={{ duration: 0.02 }}
                        title="Back to News"
                        onClick={() => router.push("/?start-section=News")}
                        className="bg-accent rounded-[27px] flex justify-center items-center hover:brightness-85 active:scale-75 transition-all ease-in-out duration-300 cursor-pointer"
                    >
                        <HStack className="text-white md:text-[18px] sm:text-[16px] text-[14px] justify-center items-center py-2 px-5" spacing={2}>
                            <News className=" sm:h-6 h-5 w-5  sm:w-6 transition-transform ease-in-out duration-300" />
                            <p>News</p>
                        </HStack>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.06 }} transition={{ duration: 0.15 }}
                        title="Share post"
                        onClick={handleShare}
                        className="bg-accent rounded-[27px] flex justify-center items-center  sm:p-3 p-3 hover:brightness-75 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer"
                    >
                        <Share className="text-white  sm:h-4 h-3  sm:w-5 w-3 transition-transform ease-in-out duration-300" />
                    </motion.button>

                </div>
            </HStack>

            <VStack className="w-full max-w-4xl mt-40" spacing={15}>

                {/* Main content */}
                <VStack className="w-full bg-foreground rounded-[30px] md:p-10 sm:p-8 p-6" spacing={20}>

                    <HStack className='items-start'>
                        <VStack className='text-start'>
                            <p className="md:text-[35px] sm:text-[35px] text-[27px] text-accent font-bold">{post.title}</p>
                            <p className="md:text-[27px] sm:text-[27px] text-[22px] text-textColor/60 -mt-2">{post.subtitle}</p>
                            <p className="md:text-[24px] sm:text-[24px] text-[18px] text-textColor/40 -mt-2">{formatDate(post.publish)}</p>
                        </VStack>
                    </HStack>

                    <Divider className='bg-sub2/70' height='h-[4px]' />

                    {/* Paragraphs with indentation */}
                    <div className="space-y-4 md:text-[18px] sm:text-[18px] text-[14px] text-start text-textColor/80 indent-10">
                        {formattedParagraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>

                    {/* Tags */}
                    <HStack spacing={6} className="flex overflow-x-auto py-[1px] px-[1px] [&::-webkit-scrollbar]:h-[0px] hover:[&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400/30 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60 justify-start">
                        {post.tags.map((text) => (
                            <p key={text} className="text-sub3 text-[12px] md:text-[15px] font-bold px-3 py-1 bg-sub2/20 rounded-[12px]">
                                {text}
                            </p>
                        ))}
                    </HStack>

                    {/* Post photo */}
                    {post.photo && (
                        <motion.div
                            onClick={() => {
                                setShow(true);
                                popUpView.current = <PicView profile={post.photo} />;
                            }}
                            whileHover={{ scale: 1.005 }}
                            transition={{ duration: 0.15 }}
                            className="relative cursor-pointer overflow-hidden flex items-center justify-start"
                        >
                            {post.photo && (
                                <Image
                                    key={post.photo}
                                    src={post.photo}
                                    alt="Photo"
                                    width={0}
                                    height={0}
                                    className="w-auto h-auto max-w-full rounded-[12px]"
                                    sizes="100vw"
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Mentioned projects */}
                    <VStack className='mt-30'>
                        <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px] items-start justify-center ml-4">Mentioned Projects</p>
                        <div className="flex sm:flex-row sm:h-full flex-col gap-4 overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:h-[0px] hover:[&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar]:w-[0px] hover:[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400/30 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60 justify-start snap-x snap-mandatory p-1">

                            {loading ? (
                                <>
                                    <ProjSectionPlaceHolder />
                                    <ProjSectionPlaceHolder />
                                </>
                            ) : (
                                <>
                                    {filteredProjects.map((p: Project, i: number) => (
                                        <ProjSection key={i} project={p} index={i} setShow={setShow} view={popUpView} />
                                    ))}
                                </>
                            )}

                        </div>
                    </VStack>

                </VStack>

                {/* Footer */}
                <VStack className="text-center my-20 md:text-[15px] sm:text-[15px] text-[10px]">
                    <p className="text-sub2">© {year} Garrett Butchko. All rights reserved.</p>
                </VStack>

                {/* Popup */}
                <BlurOverlay show={show} onClose={() => setShow(false)}>
                    {popUpView.current}
                </BlurOverlay>

            </VStack>
        </main>
    );
}
