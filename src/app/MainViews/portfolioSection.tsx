import { HStack, VStack, Spacer } from "../Components/components";
import Search from "../../../public/svg/search.svg";
import React, { useState, useRef, useEffect } from "react";
import { Project } from "@/app/Types/Project"
import { ProjSection, ProjSectionPlaceHolder } from "@/app/Components/projectSection";
import Arrow from "../../../public/svg/arrow.svg";


export default function PortfolioSection() {

    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const searchBarRef = useRef<HTMLInputElement | null>(null);
    const [shownProj, setShownProjs] = useState<number[]>([1, 2, 3, 4]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selected, setSelected] = useState("");
    const [sortFirst, setSortFirst] = useState(true);

    useEffect(() => {
        // prevent running before localStorage is available (server-side)
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

                // Only update if data actually changed
                if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
                    setProjects(data);
                    localStorage.setItem("projects", JSON.stringify(data));
                }
            })
            .catch((err) => console.error("Error loading projects:", err))
            .finally(() => setLoading(false));

    }, []);


    const languages: string[] = [
        "Swift",
        "JavaScript",
        "Shell",
        "TypeScript",
        "Python",
        "Java",
        "C",
        "C++",
        "C#",
        "PHP",
        "Ruby",
        "Go",
        "Rust",
        "Kotlin",
        "Dart",
        "Scala",
        "Haskell",
        "R",
        "Objective C",
        "HTML",
        "CSS",
        "SQL",
        "MATLAB",
    ];

    const filteredProjects = projects
        .filter((p, i) =>
            (query === "" ||
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.type.toLowerCase().includes(query.toLowerCase())) &&
            (selected === "" || Object.keys(p.languages).includes(selected)) &&
            shownProj.includes(i + 1)
        )
        .sort((a, b) => {
            if (sortFirst) {
                // Newest first
                return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
            } else {
                // Oldest first
                return new Date(a.pushed_at).getTime() - new Date(b.pushed_at).getTime();
            }
        });




    return (
        <VStack className="mt-40 justify-center items-center w-full" spacing={15}>
            <div className="flex flex-col sm:flex-row mx-1" style={{ gap: "8px" }}>
                <HStack ref={searchBarRef} className="md:h-14 sm:h-12 h-10 bg-foreground rounded-[30px] justify-start items-center px-5">
                    <Search className="md:h-6 md:w-6 sm:h-5 sm:w-5 h-4 w-4 text-sub2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onFocus={() => setFocused(true)}
                        onBlur={(e) => {
                            if (!e.target.value) setFocused(false);
                        }}
                        onChange={(e) => setQuery(e.target.value)}
                        className="ml-2 text-sub2 md:text-[20px] sm:text-[18px] text-[15px] bg-transparent outline-none"
                    />
                </HStack>
                <HStack className="" spacing={8}>
                    <NativeDropdown />
                    <button
                        type="button"
                        onClick={() =>
                            (setSortFirst(!sortFirst))
                        }
                        className="
                            bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-2
                            hover:brightness-75
                            active:scale-95 
                            transition-all
                            ease-in-out
                            duration-300
                            cursor-pointer
                        ">
                        <Arrow className={`text-blue-500 md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6
                            transition-transform
                            ease-in-out
                            duration-300
                            ${sortFirst ? "rotate-0" : "rotate-180"}`} />
                    </button>
                </HStack>
            </div>


            <VStack className="mb-4 mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px] p-6" spacing={45}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[1fr]">
                    {loading ? (
                        <>
                            <ProjSectionPlaceHolder />
                            <ProjSectionPlaceHolder />
                            <ProjSectionPlaceHolder />
                            <ProjSectionPlaceHolder />
                        </>
                    ) : (
                        <>
                            {filteredProjects.map((item, i) => (
                                <ProjSection key={i} project={item} index={i} />
                            ))}
                            {filteredProjects.length < 4 && (
                                // Add placeholders to make at least 4 items
                                <>
                                    {Array.from({ length: 4 - filteredProjects.length }).map((_, i) => (
                                        <ProjSectionPlaceHolder key={`placeholder-${i}`} animate={false} className="opacity-0" />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </VStack>
        </VStack>
    );

    function NativeDropdown() {
        return (
            <div className="flex rounded-full bg-foreground px-4 items-center justify-center w-full h-full">

                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="text-sub2 bg-transparent outline-none md:text-[16px] sm:text-[14px] text-[12px]"
                >
                    <option value="">Language</option>

                    {languages.map((language, i) => (
                        <option key={i} value={language}>{language}</option>
                    ))}
                </select>

            </div>
        );
    }
}