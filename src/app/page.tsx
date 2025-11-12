"use client";

import React, { useState, useRef, useEffect } from "react";
import HomeIcon from '../../public/svg/home.svg';
import NewsIcon from '../../public/svg/news.svg';
import PortfolioIcon from '../../public/svg/portfolio.svg';
import { FloatingBar } from "./Components/floatingbar";
import HomeSection from "./MainViews/homeSection";
import PortfolioSection from "./MainViews/portfolioSection";
import NewsSection from "./MainViews/newsSection";
import { VStack, HStack } from "@/app/Components/components";
import { moveDivToIndex } from "./Components/floatingbar";
import { useSearchParams, useRouter } from "next/navigation";

type TargetSerializable = {
  id: number;
  name: string;
  isSelected: boolean;
};

type Target = TargetSerializable & {
  icon: React.ReactElement;
};

const iconsMap: Record<string, React.ReactElement> = {
  Home: <HomeIcon className="w-5 h-5" />,
  Portfolio: <PortfolioIcon className="w-5 h-5" />,
  News: <NewsIcon className="w-5 h-5" />,
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cachedTarget = typeof window !== "undefined" ? localStorage.getItem("target") : null;
  const sectionFromCache = cachedTarget ? (JSON.parse(cachedTarget) as "Home" | "Portfolio" | "News") : null;
  const sectionFromUrl = searchParams?.get("start-section") as "Home" | "Portfolio" | "News" | null;

  // Initial section priority: URL > localStorage > default
  const initialSection: "Home" | "Portfolio" | "News" = sectionFromUrl ?? sectionFromCache ?? "Home";

  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targets, setTargets] = useState<Target[]>(() => [
    { id: 1, name: "Home", isSelected: initialSection === "Home", icon: <HomeIcon className="w-5 h-5" /> },
    { id: 2, name: "Portfolio", isSelected: initialSection === "Portfolio", icon: <PortfolioIcon className="w-5 h-5" /> },
    { id: 3, name: "News", isSelected: initialSection === "News", icon: <NewsIcon className="w-5 h-5" /> },
  ]);

  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  // Mark mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return;
    const active = targets.find(t => t.isSelected)?.name ?? "Home";
    localStorage.setItem("target", JSON.stringify(active));
  }, [targets, mounted]);

  if (!mounted) return null;

  const active = targets.find(t => t.isSelected)?.name ?? "Home";

  const handleSectionChange = (sectionName: string, index: number) => {
    // Update targets state
    setTargets(prev =>
      prev.map((t, i) => ({ ...t, isSelected: i === index }))
    );

    // Move FloatingBar
    moveDivToIndex({ index, setPosition, setTargets });

    // Update URL without reload
    router.replace(`/?start-section=${sectionName}`, { scroll: false });

    // Scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <main className="flex items-top justify-center min-h-screen bg-background">
      <FloatingBar targets={targets} setTargets={setTargets} buttonRefs={buttonRefs} />

      <VStack className="w-full items-center mx-3">
        {active === "Home" && <HomeSection />}
        {active === "Portfolio" && <PortfolioSection />}
        {active === "News" && <NewsSection />}

        <VStack className="my-20 md:text-[15px] sm:text-[15px] text-[10px]">
          <HStack className="justify-center">
            {targets.map((target: Target, i: number) => (
              <button
                key={target.id}
                type="button"
                onClick={() => handleSectionChange(target.name, i)}
                className="cursor-pointer"
              >
                <HStack>
                  <p className="text-sub2 ml-1">{target.name}</p>
                  {i !== targets.length - 1 && <p className="text-sub2 mx-1">|</p>}
                </HStack>
              </button>
            ))}
          </HStack>
          <p className="text-sub2">
            © {new Date().getFullYear()} Garrett Butchko. All rights reserved.
          </p>
        </VStack>
      </VStack>
    </main>
  );
}
