import { HStack, VStack } from "../Components/components";
import Search from "../../../public/svg/search.svg";
import React, { useState, useRef, useEffect } from "react";
import { Project } from "@/app/Types/Project"
import { ProjSection, ProjSectionPlaceHolder } from "@/app/Components/projectSection";


export default function PortfolioSection() {

    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const searchBarRef = useRef<HTMLInputElement | null>(null);
    const [shownProj, setShownProjs] = useState<Project[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error loading projects:", err))
            .finally(() => setLoading(false));
    }, []);


    return (
        <VStack className="mt-40 justify-center items-center w-full" spacing={15}>
            <HStack className="mx-6" spacing={10}>
                <HStack ref={searchBarRef} className="w-full max-w-120 md:h-14 sm:h-12 h-10 bg-foreground rounded-[30px] justify-start items-center px-5">
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
                        className={`ml-2 w-full text-sub2 md:text-[20px] sm:text-[18px] text-[15px] bg-transparent outline-none transition-all duration-500
                    ${focused ? "translate-x-0" : "left-1/2 -translate-x-1/2"}} ease-in-out`}
                    />
                    <Search className="h-6 w-6 text-transparent" />
                </HStack>
                <NativeDropdown />
            </HStack>


            <VStack className="mb-4 mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px] p-6" spacing={45}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                    {loading ? (
                        <>
                            <ProjSectionPlaceHolder />
                            <ProjSectionPlaceHolder />
                            <ProjSectionPlaceHolder />
                            <ProjSectionPlaceHolder />
                        </>
                    ) : (
                        projects
                            .filter(
                                (p) =>
                                    query === "" ||
                                    p.title.toLowerCase().includes(query.toLowerCase()) ||
                                    p.type.toLowerCase().includes(query.toLowerCase())
                            )
                            .map((item, i) => <ProjSection key={i} project={item} index={i} />)
                    )}
                </div>
            </VStack>
        </VStack>
    );

    function NativeDropdown() {
        return (
            <div className="flex rounded-full bg-foreground px-4 items-center justify-center">
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="text-sub2 bg-transparent outline-none md:text-[16px] sm:text-[14px] text-[12px]"
                >
                    <option value="">Language</option>
                    <option value="Mini Mate">Mini Mate</option>
                    <option value="HavenHub">HavenHub</option>
                    <option value="Portfolio">Portfolio</option>
                </select>
            </div>
        );
    }
}