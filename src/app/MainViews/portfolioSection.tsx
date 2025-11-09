import { HStack, VStack } from "../Components/components";
import Search from "../../../public/svg/search.svg";
import React, { useState, useEffect } from "react";
import { Project } from "@/app/Types/Project"
import { ProjSection, ProjSectionPlaceHolder } from "@/app/Components/projectSection";
import Arrow from "../../../public/svg/arrow.svg";



export default function PortfolioSection() {

    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [shownProj, setShownProjs] = useState<number[]>([1, 2, 3, 4]);
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

    // 1️⃣ Filter and sort first
    const filteredProjects = projects
        .filter((p) => {
            const matchesSearch =
                query === "" ||
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.type.toLowerCase().includes(query.toLowerCase());

            const matchesLanguage =
                selected === "" || Object.keys(p.languages).includes(selected);

            return matchesSearch && matchesLanguage;
        })
        .sort((a, b) => {
            return sortFirst
                ? new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
                : new Date(a.pushed_at).getTime() - new Date(b.pushed_at).getTime();
        });

    // 2️⃣ Then apply pagination (shownProj)
    const paginatedProjects = filteredProjects.filter((_, i) =>
        shownProj.includes(i + 1)
    );

    const canAddPage: boolean = ((paginatedProjects.length + shownProj[0]) - 1) != filteredProjects.length;

    const canSubtractPage: boolean = shownProj[0] != 1

    return (
        <VStack className="mt-40 justify-center items-center w-full" spacing={15}>
            <div className="flex flex-col sm:flex-row" style={{ gap: "8px" }}>
                <HStack
                    className="flex-1 min-h-9 bg-foreground rounded-[30px] justify-start items-center px-5"
                >
                    <Search className="md:h-6 md:w-6 sm:h-5 sm:w-5 h-4 w-4 text-sub2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShownProjs([1, 2, 3, 4]);
                        }}
                        className="ml-2 text-sub2 md:text-[20px] sm:text-[18px] text-[15px] bg-transparent outline-none w-full md:min-w-100 sm:min-w-75 min-w-50"
                    />
                </HStack>

                <HStack className="w-full" spacing={8}>
                    <NativeDropdown />
                    <button
                        title="Sort projects by newest or oldest"
                        type="button"
                        onClick={() => {
                            (setSortFirst(!sortFirst))
                            setShownProjs([1, 2, 3, 4]);
                        }
                        }
                        className="
                            bg-foreground rounded-full flex justify-center items-center md:p-4 sm:p-3 p-2
                            hover:bg-oppbackground/5
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


            <VStack className="mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px] p-6" spacing={45}>



                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[1fr]">
                        <ProjSectionPlaceHolder />
                        <ProjSectionPlaceHolder />
                        <ProjSectionPlaceHolder />
                        <ProjSectionPlaceHolder />
                    </div>
                ) : paginatedProjects && paginatedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[1fr]">
                        {paginatedProjects.map((item, i) => (
                            <ProjSection key={i} project={item} index={i} />
                        ))}
                        {paginatedProjects.length < 4 && (
                            // Add placeholders to make at least 4 items
                            <>
                                {Array.from({ length: 4 - paginatedProjects.length }).map((_, i) => (
                                    <ProjSectionPlaceHolder key={`placeholder-${i}`} animate={false} className="opacity-0" />
                                ))}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full">
                        <HStack>
                            <ProjSectionPlaceHolder animate={false} className="opacity-0" />
                            <ProjSectionPlaceHolder animate={false} className="opacity-0" />
                        </HStack>

                        <p className="text-sub2 py-6 text-center w-full">No projects yet...</p>

                        <HStack>
                            <ProjSectionPlaceHolder animate={false} className="opacity-0" />
                            <ProjSectionPlaceHolder animate={false} className="opacity-0" />
                        </HStack>
                    </div>
                )}
            </VStack>
            <p className="text-sub2">
                Showing {filteredProjects.length == 0 ? 0 : shownProj[0]} to {(paginatedProjects.length + shownProj[0]) - 1} of {filteredProjects.length} Projects
            </p>
            <HStack spacing={8}>
                <button
                    type="button"
                    onClick={() => {
                        if (canSubtractPage) {
                            const updated = shownProj.map(n => n - 4);
                            setShownProjs(updated);
                        }
                    }}
                    className={`${canSubtractPage ? "hover:bg-oppbackground/5 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer" : ""}
                        bg-foreground 
                        rounded-full 
                        flex 
                        justify-center 
                        items-center 
                        md:p-4 
                        sm:p-3 
                        p-2
                    `}>
                    <HStack className={`${canSubtractPage ? "text-blue-500" : "text-sub2"} md:text-[16px] sm:text-[14px] text-[12px] justify-center items-center`} spacing={5}>
                        <Arrow className="
                            md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6
                            rotate-270
                        "/>
                        <p>
                            Previous
                        </p>
                    </HStack>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (canAddPage) {
                            const updated = shownProj.map((n) => n + 4);
                            setShownProjs(updated);
                        }
                    }}
                    className={`${canAddPage ? "hover:bg-oppbackground/5 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer" : ""}
                        bg-foreground 
                        rounded-full 
                        flex 
                        justify-center 
                        items-center 
                        md:p-4 sm:p-3 p-2
                        `}>
                    <HStack className={`${canAddPage ? "text-blue-500" : "text-sub2"} md:text-[16px] sm:text-[14px] text-[12px] justify-center items-center`} spacing={5}>
                        <p>
                            Next
                        </p>
                        <Arrow className="md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6
                            transition-transform
                            ease-in-out
                            duration-300
                            rotate-90"/>
                    </HStack>
                </button>
            </HStack>
        </VStack >
    );

    function NativeDropdown() {
        return (
            <div className="flex rounded-full bg-foreground px-4 items-center justify-center w-full h-full">
                <select
                    title="Sort projects by what languages were used"
                    value={selected}
                    onChange={(e) => {
                        setSelected(e.target.value)
                        setShownProjs([1, 2, 3, 4]);
                    }}
                    className="text-sub2 bg-transparent outline-none md:text-[16px] sm:text-[14px] text-[12px] cursor-pointer"
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