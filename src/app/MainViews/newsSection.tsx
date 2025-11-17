
import { VStack, HStack, Spacer, Text } from "../Components/Components";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Search from "../../../public/svg/search.svg";
import Arrow from "../../../public/svg/arrow.svg";
import { Post, Project } from "@/app/types";
import BlurOverlay from "@/app/Components/BlurOverlay";
import { useRouter } from "next/navigation";
import { slugify } from '@/app/lib/slugify';
import { motion } from "framer-motion";
import { PicView } from "../Components/PicView";
import { formatDate } from "../lib/formatDate"



export default function NewsSection() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortFirst, setSortFirst] = useState(true);
    const [shownPosts, setShownPosts] = useState(5);
    const [posts, setPosts] = useState<Post[]>([]);
    const [show, setShow] = useState(false);
    const popUpView = useRef<React.ReactNode>(
        <div className="text-textColor text-center font-bold">
            Nothing Here Yet :)...
        </div>
    );

    useEffect(() => {
        if (show) {
            // Lock scroll and save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.overflowY = "scroll";
            document.body.style.width = "100%";

            return () => {
                // Restore scroll position
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.left = "";
                document.body.style.right = "";
                document.body.style.overflowY = "";
                document.body.style.width = "";
                window.scrollTo(0, scrollY);
            };
        }
    }, [show]);


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

    const addMore = posts.length - shownPosts > 0;

    const filteredPosts = useMemo(() => {
        return posts
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
    }, [posts, query, sortFirst]);


    return (
        <div className="w-full">
            <VStack className="mt-40 justify-center items-center w-full" spacing={15}>
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
                                setShownPosts(5);
                            }}
                            className="ml-2 text-sub2 md:text-[20px] sm:text-[18px] text-[15px] bg-transparent outline-none w-full md:min-w-100 sm:min-w-75 min-w-40"
                        />
                    </HStack>

                    <button
                        title="Sort posts by newest or oldest"
                        type="button"
                        onClick={() => {
                            setSortFirst(!sortFirst);
                            setShownPosts(5);
                        }}
                        className="
                        bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-2
                        hover:brightness-75
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
                </div>

                {/* 📰 Post List */}
                <VStack className="mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px] p-6 justify-center items-center" spacing={45}>

                    {loading ? (
                        <>
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                        </>
                    ) : filteredPosts && filteredPosts.length > 0 ? (
                        <>
                            {filteredPosts.slice(0, shownPosts).map((post, i) => (
                                <PostView key={post.id} post={post} index={i} setShow={setShow} popUpView={popUpView} />
                            ))}

                            {/* Add placeholders if less than 5 items */}
                            {filteredPosts.length < 5 &&
                                Array.from({ length: 5 - filteredPosts.length }).map((_, i) => (
                                    <PostViewPlaceHolder
                                        key={`placeholder-${i}`}
                                        animate={false}
                                        className="opacity-0"
                                    />
                                ))}
                        </>
                    ) : (
                        <>
                            <PostViewPlaceHolder animate={false} className="opacity-0" />
                            <PostViewPlaceHolder animate={false} className="opacity-0" />
                            <p className="text-sub2 py-6">No posts yet...</p>
                            <PostViewPlaceHolder animate={false} className="opacity-0" />
                            <PostViewPlaceHolder animate={false} className="opacity-0" />
                        </>
                    )}

                </VStack>
                {/* ➕ More Button */}
                <HStack spacing={8}>
                    <button
                        type="button"
                        onClick={() => addMore && setShownPosts(shownPosts + 5)}
                        className={`${addMore ? "hover:bg-oppbackground/5 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer" : ""}
                        bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-2
                    `}
                    >
                        <HStack
                            className={`${addMore ? "text-accent" : "text-sub2"} md:text-[16px] sm:text-[14px] text-[12px] justify-center items-center px-2`}
                            spacing={5}
                        >
                            <p>More...</p>
                        </HStack>
                    </button>
                </HStack>
            </VStack>
            <BlurOverlay show={show} onClose={() => setShow(false)}>
                {popUpView.current}
            </BlurOverlay>
        </div>
    );
}

// ✅ PostView Component
type PostViewProps = {
    post: Post;
    index: number;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    popUpView: React.RefObject<React.ReactNode>;
};

export function PostView({ post, index, setShow, popUpView }: PostViewProps) {
    const router = useRouter();

    const goToPost = (postTitle: string) => {
        router.push(`/news/${slugify(postTitle)}`);
    };

    return (
        <VStack

            className="relative bg-sub1 rounded-[15px] w-full justify-center items-center overflow-visible mb-[16px]"
            spacing={10}
        >
            {/* --- Content --- */}
            <div className="flex sm:flex-row flex-col p-6 justify-center items-center w-full">
                <VStack
                    className="
                        sm:items-start items-center
                        sm:text-left text-center
                        sm:justify-start justify-center
                    "
                    spacing={6}
                >
                    <p
                        className="
                            md:text-[30px]
                            sm:text-[26px]
                            text-[23px] 
                            font-bold  
                            transition-all
                            ease-in-out
                            duration-200
                            text-accent
                        "
                    >
                        {post.title}
                    </p>

                    <p
                        className="
                            text-sub3 
                            md:text-[15px] 
                            sm:text-[12px] 
                            text-[10px] 
                            truncate
                            -mt-3
                        "
                    >
                        {post.subtitle}
                    </p>


                    <p
                        className="
                            text-sub2 
                            md:text-[14px] 
                            sm:text-[11px] 
                            text-[9px] 
                            truncate
                            -mt-2
                        "
                    >
                        {formatDate(post.publish)}
                    </p>


                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <HStack
                            spacing={6}
                            className="
                                hidden sm:flex
                                overflow-x-auto
                                py-[1px] px-[1px]
                                [&::-webkit-scrollbar]:h-[0px]
                                hover:[&::-webkit-scrollbar]:h-[6px]
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-400/30
                                hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
                                sm:justify-start justify-center
                            "
                        >
                            {post.tags.map((text) => (
                                <p
                                    key={text}
                                    className="text-sub3 text-[12px] md:text-[15px] font-bold px-3 py-1 bg-sub2/20 rounded-[12px]"
                                >
                                    {text}
                                </p>
                            ))}
                        </HStack>
                    )}

                </VStack>

                <Spacer />

                <VStack spacing={6}>
                    {post.photo && (
                        <motion.div
                            onClick={() => {
                                if (post.photo) {
                                    setShow(true);
                                    popUpView.current = (
                                        <PicView profile={post.photo} />
                                    );
                                }
                            }}
                            whileHover={{ scale: 1.06 }} transition={{ duration: 0.15 }}
                            className='max-w-40 max-h-[80vh] h-auto w-auto cursor-pointer' >
                            <img src={post.photo} alt="Photo" className="rounded-[12px]" />
                        </motion.div>
                    )}

                    <HStack
                        spacing={6}
                        className="
                        sm:hidden
                        flex
                            overflow-x-auto
                            py-[1px] px-[1px]
                            [&::-webkit-scrollbar]:h-[0px]
                            hover:[&::-webkit-scrollbar]:h-[6px]
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-gray-400/30
                            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
                            sm:justify-start justify-center
                        "
                    >
                        {post.tags.map((text) => (
                            <p
                                key={text}
                                className="text-sub3 text-[12px] md:text-[15px] font-bold px-3 py-1 bg-sub2/20 rounded-[12px]"
                            >
                                {text}
                            </p>
                        ))}
                    </HStack>
                </VStack>
            </div>

            {/* --- Floating Button --- */}
            <motion.button
                whileHover={{ scale: 1.06 }} transition={{ duration: 0.03 }}
                type="button"
                onClick={() => {
                    goToPost(post.title);
                }}

                className="
                    absolute 
                    bottom-[-16px] 
                    z-20 
                    rounded-[25px]
                    active:scale-95 
                    transition-all
                    ease-in-out
                    duration-300
                    bg-accent hover:brightness-75
                    cursor-pointer
                    flex
                    justify-center
                    items-center
                "
                style={{
                    width: 80,
                    height: 32,
                }}
            >
                <Text
                    variant="body"
                    className="text-white transition-all ease-in-out duration-300"
                >
                    Info
                </Text>
            </motion.button>
        </VStack>
    );
}

export function PostViewPlaceHolder({ className, animate = true }: { className?: string, animate?: boolean }) {
    return (
        <VStack
            className={`relative bg-sub1 rounded-[20px] w-full overflow-visible mb-4 ${animate ? "animate-pulse" : ""} ${className ?? ""}`}
            spacing={4}
        >
            <div className="flex flex-col sm:flex-row p-6 w-full rounded-[12px] bg-sub2/30 gap-4">
                {/* Left content */}
                <VStack spacing={5} className="sm:items-start items-center sm:text-left text-center">
                    <div className="h-[40px] w-[180px] rounded-[12px] bg-sub2/30"></div>
                    <div className="h-[12px] w-[80px] rounded-[12px] bg-sub2/30"></div>

                    <HStack spacing={2} className="hidden sm:flex">
                        <div className="h-[30px] w-[180px] rounded-[12px] bg-sub2/30"></div>
                    </HStack>
                </VStack>

                <Spacer />

                {/* Right content */}
                <VStack spacing={2} className="items-center">
                    <div className="w-[150px] h-[85px] rounded-[12px] bg-sub2/30"></div>

                    <HStack spacing={2} className="flex sm:hidden justify-center mt-2">
                        <div className="h-[25px] w-[60px] rounded-[12px] bg-sub2/30"></div>
                    </HStack>
                </VStack>
            </div>
        </VStack>
    );
}
