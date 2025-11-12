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
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [targets, setTargets] = useState<Target[]>(() => {
    if (typeof window === "undefined") return []; // SSR-safe

    const cached = localStorage.getItem("targets");
    if (cached) {
      const parsed: TargetSerializable[] = JSON.parse(cached);
      return parsed.map(t => ({ ...t, icon: iconsMap[t.name] }));
    }

    // default targets
    return [
      { id: 1, name: "Home", isSelected: true, icon: <HomeIcon className="w-5 h-5" /> },
      { id: 2, name: "Portfolio", isSelected: false, icon: <PortfolioIcon className="w-5 h-5" /> },
      { id: 3, name: "News", isSelected: false, icon: <NewsIcon className="w-5 h-5" /> },
    ];
  });

  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  // 2️⃣ Set mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3️⃣ Save to localStorage effect (only after mount)
  useEffect(() => {
    if (!mounted) return; // ✅ client-only
    const serializableTargets = targets.map(({ id, name, isSelected }) => ({ id, name, isSelected }));
    localStorage.setItem("targets", JSON.stringify(serializableTargets));
  }, [targets, mounted]);

  // 4️⃣ Conditional rendering comes after hooks
  if (!mounted) return null;

  const active = targets.find((t: Target) => t.isSelected)?.name ?? "Home";


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
                onClick={() => {
                  moveDivToIndex({ index: i, setPosition, setTargets });
                  window.scrollTo(0, 0); // instant scroll to top
                }}
                className="cursor-pointer"
              >
                <HStack>
                  <p className="text-sub2 ml-1">{target.name}</p>
                  {(i !== targets.length - 1) && <p className="text-sub2 mx-1">|</p>}
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
