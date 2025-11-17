"use client";

import { VStack, HStack, Spacer } from "../Components/Components";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Search from "../../../public/svg/search.svg";
import Arrow from "../../../public/svg/arrow.svg";
import Plus from "../../../public/svg/plus.svg";
import Lock from "../../../public/svg/lock.svg";
import { Post, Project } from "@/app/types";
import { PostViewPlaceHolder } from "@/app/MainViews/NewsSection";
import BlurOverlay from "@/app/Components/BlurOverlay";
import { motion } from "framer-motion";
import { formatDate } from "../lib/formatDate"
import DragDropUpload from "../Components/DragAndDrop"
import { downloadImageAsFile } from "../lib/downloadImageAsFile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import saveProjectWithFileRealtime from "../lib/saveProjectWithFileRealtime";

const defaultPost = {
    id: 1,
    title: "",
    subtitle: "",
    tags: [],
    relatedProjects: [],
    body: "",
    photo: null,
    publish: new Date(), // must be a Date
}

export default function AdminPage() {
    const [query, setQuery] = useState("");
    const [sortFirst, setSortFirst] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [show, setShow] = useState(false);
    const popUpView = useRef<React.ReactNode>(
        <div className="text-textColor text-center font-bold">
            Nothing Here Yet :)...
        </div>
    );

    const maxId = useMemo(() => {
        if (!posts.length) return 0;
        return Math.max(...posts.map(p => p.id));
    }, [posts]);

    const handleUnlock = async () => {
        const res = await fetch("/api/check-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: inputKey }),
        });

        const data = await res.json();

        if (data.authorized) {
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
                const normalized = data.map((p: Post) => ({
                    ...p,
                    publish: new Date(p.publish),
                }));
                setPosts(normalized);
                localStorage.setItem("posts", JSON.stringify(normalized));
            })
            .catch((err) => console.error("Error loading posts:", err))
            .finally(() => setLoading(false));
    }, []);



    const filteredPosts = useMemo(() => {
        const q = query.toLowerCase();

        // 1. Filter posts
        const filtered = posts.filter((p) => {
            return (
                q === "" ||
                p.title.toLowerCase().includes(q) ||
                p.subtitle.toLowerCase().includes(q) ||
                p.tags.some(tag => tag.toLowerCase().includes(q)) // <-- FIXED
            );
        });

        // 2. Sort posts
        return filtered.sort((a, b) => {
            return sortFirst
                ? new Date(b.publish).getTime() - new Date(a.publish).getTime()
                : new Date(a.publish).getTime() - new Date(b.publish).getTime();
        });
    }, [posts, query, sortFirst]);

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
            <VStack className="mt-20 mb-20 justify-center items-center mx-3" spacing={15}>
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

                    <button
                        type="button"
                        onClick={() => {
                            popUpView.current = (
                                <EditAddPostView
                                    id={maxId + 1}
                                    workingPost={{ ...defaultPost }}
                                    setPosts={setPosts}
                                    setShow={setShow}
                                />
                            );
                            setShow(true)
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
                        <Plus className="text-accent md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6" />
                    </button>
                </div>

                {/* 📰 Post List */}
                <VStack className="mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px] p-6 justify-center items-center" spacing={25}>

                    {loading ? (
                        <>
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                            <PostViewPlaceHolder />
                        </>
                    ) : filteredPosts && filteredPosts.length > 0 ? (
                        <>
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="flex sm:flex-row flex-col items-center p-6 bg-sub1 rounded-[15px] w-full gap-2">
                                    <VStack className="sm:text-start text-center w-full">
                                        <p className="text-accent font-bold">
                                            {post.title}
                                        </p>
                                        <p className="text-sub3 -mt-1">
                                            {post.subtitle}
                                        </p>
                                        <p
                                            className="
                                                text-sub2 
                                                md:text-[14px] 
                                                sm:text-[11px] 
                                                text-[9px] 
                                                truncate
                                                -mt-1
                                            "
                                        >
                                            {formatDate(post.publish)}
                                        </p>
                                    </VStack>
                                    <Spacer />
                                    <motion.button
                                        whileHover={{ scale: 1.06 }} transition={{ duration: 0.03 }}
                                        type="button"
                                        onClick={() => {


                                            popUpView.current = (
                                                <EditAddPostView
                                                    id={post.id}
                                                    workingPost={post}   // ← FIXED
                                                    setPosts={setPosts}
                                                    setShow={setShow}
                                                />
                                            );

                                            setShow(true);
                                        }}


                                        className="z-20 rounded-[25px] active:scale-95 transition-all ease-in-out duration-300 bg-accent hover:brightness-75 cursor-pointer h-8 w-25 flex justify-center items-center"
                                    >
                                        <span className="text-white font-semibold">Edit</span>
                                    </motion.button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <p className="text-sub2 py-6">No posts yet...</p>
                        </>
                    )}
                </VStack>
            </VStack>

            <VStack className="my-20 md:text-[15px] sm:text-[15px] text-[10px] text-center">
                <p className="text-sub2">
                    © {new Date().getFullYear()} Garrett Butchko. All rights reserved.
                </p>
            </VStack>

            <BlurOverlay show={show} onClose={() => setShow(false)} showXAndTap={false}>
                {popUpView.current}
            </BlurOverlay>
        </div>
    );
}

function EditAddPostView({
    workingPost,
    id,
    setPosts,
    setShow,
}: {
    workingPost: Post;
    id: number;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}) {


    const [projects, setProjects] = useState<Project[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    function getFileNameFromUrl(url: string | null): string {
        if (url) {
            const cleanUrl = url.split("?")[0]; // remove query params
            return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
        } else {
            return "photo.png"
        }
    }

    useEffect(() => {
        if (!workingPost.photo) return;
        async function loadImage() {
            const fileName = getFileNameFromUrl(workingPost.photo);
            const file = await downloadImageAsFile(workingPost.photo, fileName);
            setPhotoFile(file);   // file will be File or null
        }

        loadImage();
    }, [workingPost.photo]);

    // ✅ Fetch projects from API and cache in localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem("projects");
        if (cached) {
            setProjects(JSON.parse(cached));
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
    }, []);

    const [localPost, setLocalPost] = useState({
        ...workingPost,
        id: id,  // <- force correct ID
    });




    const addTag = () => {
        setLocalPost(prev => ({
            ...prev,
            tags: [...prev.tags, ""], // add an empty string at the end
        }));
    };

    const addRelatedProject = () => {
        setLocalPost(prev => ({
            ...prev,
            relatedProjects: [...prev.relatedProjects, ""],
        }));
    };

    const removeTag = (index: number) => {
        setLocalPost(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index), // remove the tag at `index`
        }));
    };

    const removeRelatedProject = (index: number) => {
        setLocalPost(prev => ({
            ...prev,
            relatedProjects: prev.relatedProjects.filter((_, i) => i !== index), // remove project
        }));
    };



    return (
        <VStack className="bg-foreground rounded-[25px] p-6 w-full shadow-lg h-162
            overflow-x-auto
            [&::-webkit-scrollbar]:w-[0px]
            hover:[&::-webkit-scrollbar]:w-[6px]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/30
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
        " spacing={8}>
            <HStack spacing={10} className="w-full">
                {/* ID FIELD */}
                <VStack className="items-center">
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">ID</p>
                    <p className="text-sub3 font-bold md:text-[20px] sm:text-[20px] text-[13px] px-10 py-3 rounded-[12px] bg-sub1">
                        {localPost.id}
                    </p>
                </VStack>

                {/* TITLE FIELD */}
                <VStack className="items-center w-full">
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Title</p>
                    <input
                        type="text"
                        placeholder="Type Here..."
                        value={localPost.title}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLocalPost(prev => ({ ...prev, title: value }));
                        }}
                        className="
                       outline-none
                            w-full
                            text-sub3 font-bold
                            md:text-[20px] sm:text-[20px] text-[13px]
                            px-5 py-3 rounded-[12px] bg-sub1
                        "
                    />
                </VStack>

                {/* SUBTITLE FIELD */}
                <VStack className="items-center w-full">
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Subtitle</p>
                    <input
                        type="text"
                        placeholder="Type Here..."
                        value={localPost.subtitle}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLocalPost(prev => ({ ...prev, subtitle: value }));
                        }}
                        className="
                        outline-none
                            w-full
                            text-sub3 font-bold
                            md:text-[20px] sm:text-[20px] text-[13px]
                            px-5 py-3 rounded-[12px] bg-sub1
                        "
                    />
                </VStack>
            </HStack>

            {/* Body FIELD */}
            <VStack className="items-center w-full">
                <p className="text-left w-full ml-6 text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">
                    Body
                </p>

                <textarea
                    placeholder="Type Here..."
                    value={localPost.body}
                    onChange={(e) => {
                        const value = e.target.value;
                        setLocalPost(prev => ({ ...prev, body: value }));
                    }}
                    className="
                        outline-none
                        text-left
                        text-sub3
                        md:text-[20px] sm:text-[20px] text-[13px]
                        px-6 py-4 rounded-[12px] bg-sub1
                        w-full min-h-[300px] resize-none
                        overflow-x-auto py-1 px-4  min-w-0
                        transition-opacity duration-300
                        [&::-webkit-scrollbar]:w-[0px]
                        hover:[&::-webkit-scrollbar]:w-[6px]
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-400/30
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
                    "
                />
            </VStack>
            <HStack spacing={5}>
                {/*Drag and Drop*/}
                <VStack className="items-center w-full">
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Photo</p>
                    <DragDropUpload
                        photoFile={photoFile}
                        setPhotoFile={setPhotoFile}
                        onFileSelect={(file) => {
                            setPhotoFile(file)
                        }}
                    />
                </VStack>
                <div className="w-full max-w-xs items-center text-center">
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Date</p>
                    <DatePicker
                        selected={localPost.publish ?? new Date()}
                        onChange={(date: Date | null) => {
                            setLocalPost(prev => ({ ...prev, publish: date || new Date() }));
                        }}
                        dateFormat="MM-dd-yyyy"
                        placeholderText="Select a date"
                        className="outline-none px-3 py-2 rounded-[12px] w-full bg-sub1 text-sub2 w-full text-center cursor-pointer md:text-[20px] sm:text-[20px] text-[13px]"
                    />
                </div>
            </HStack>
            <HStack className="w-full text-center" spacing={10}>
                {/* Related Projects */}
                <VStack className="w-full items-center" spacing={8}>
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Related Projects</p>

                    {localPost.relatedProjects.map((project: string, i: number) => (
                        <HStack key={i} className="w-full gap-2">
                            <select
                                value={project}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setLocalPost(prev => {
                                        const updated = [...prev.relatedProjects];
                                        updated[i] = value;
                                        return { ...prev, relatedProjects: updated };
                                    });
                                }}
                                className="
                                    outline-none
                                    w-full
                                    text-sub3 font-bold
                                    md:text-[20px] sm:text-[20px] text-[13px]
                                    px-5 py-3 rounded-[12px] bg-sub1
                                "
                            >
                                <option value="">Select a project</option>
                                {projects.map((opt) => (
                                    <option key={opt.title} value={opt.title}>
                                        {opt.title}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() => removeRelatedProject(i)}
                                className="
                                    flex justify-center items-center p-2
                                    hover:brightness-75
                                    active:scale-95
                                    transition-all
                                    ease-in-out
                                    duration-300
                                    cursor-pointer
                                "
                            >
                                <Plus className="text-red-500 md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6 rotate-45" />
                            </button>
                        </HStack>
                    ))}

                    <button
                        type="button"
                        onClick={addRelatedProject}
                        className="
                            w-20 bg-accent rounded-full flex justify-center items-center p-2
                            hover:brightness-75
                            active:scale-95
                            transition-all
                            ease-in-out
                            duration-300
                            cursor-pointer
                        "
                    >
                        <Plus className="text-white md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6" />
                    </button>
                </VStack>

                {/* Tags */}
                <VStack className="w-full items-center" spacing={8}>
                    <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Tags</p>

                    {localPost.tags.map((tag: string, i: number) => (
                        <HStack key={i} className="w-full gap-2">
                            <input
                                type="text"
                                placeholder="Type Here..."
                                value={tag}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setLocalPost(prev => {
                                        const updated = [...prev.tags];
                                        updated[i] = value;
                                        return { ...prev, tags: updated };
                                    });
                                }}
                                className="
                                    outline-none
                                    w-full
                                    text-sub3 font-bold
                                    md:text-[20px] sm:text-[20px] text-[13px]
                                    px-5 py-3 rounded-[12px] bg-sub1
                                "
                            />
                            <button
                                type="button"
                                onClick={() => removeTag(i)}
                                className="
                                    flex justify-center items-center p-2
                                    hover:brightness-75
                                    active:scale-95
                                    transition-all
                                    ease-in-out
                                    duration-300
                                    cursor-pointer
                                "
                            >
                                <Plus className="text-red-500 md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6 rotate-45" />
                            </button>
                        </HStack>
                    ))}

                    <button
                        type="button"
                        onClick={addTag}
                        className="
                            w-20 bg-accent rounded-full flex justify-center items-center p-2
                            hover:brightness-75
                            active:scale-95
                            transition-all
                            ease-in-out
                            duration-300
                            cursor-pointer
                        "
                    >
                        <Plus className="text-white md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6" />
                    </button>
                </VStack>
            </HStack>
            <HStack spacing={10} className="w-full justify-center">
                <button
                    type="button"
                    className="
                        bg-red-500 text-white px-6 py-2 rounded-full
                        hover:brightness-75
                        active:scale-95
                        transition-all
                        ease-in-out
                        duration-300
                        cursor-pointer
                    "
                    onClick={() => {
                        setShow(false);
                        console.log("Cancelled");
                    }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    onClick={async () => {
                        const result = await saveProjectWithFileRealtime({
                            file: photoFile ?? null,
                            post: localPost
                        });

                        if (result.success) {
                            console.log("Upload + save complete:", result.payload);
                            setShow(false); // close the popup

                            // Update or add post in state
                            setPosts(prev => {
                                const exists = prev.some(p => p.id === localPost.id);

                                let updated;

                                if (exists) {
                                    updated = prev.map(p =>
                                        p.id === localPost.id ? { ...p, ...localPost } : p
                                    );
                                } else {
                                    updated = [...prev, localPost];
                                }

                                return updated;
                            });

                        } else {
                            console.error("Failed to save post:", result.error);
                            alert("There was an error saving your post.");
                        }
                    }}
                    className="
                        bg-blue-500 text-white px-6 py-2 rounded-full
                        hover:brightness-75
                        active:scale-95
                        transition-all
                        ease-in-out
                        duration-300
                        cursor-pointer
                    "
                >
                    Submit
                </button>

            </HStack>

        </VStack>
    );
}


