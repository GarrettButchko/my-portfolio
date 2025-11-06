"use client";

import React, { useState, useRef } from "react";
import HomeIcon from '../../public/svg/home.svg';
import NewsIcon from '../../public/svg/news.svg';
import PortfolioIcon from '../../public/svg/portfolio.svg';
import { FloatingBar } from "./Components/floatingbar";
import HomeSection from "./MainViews/homeSection"
import PortfolioSection from "./MainViews/portfolioSection"
import NewsSection from "./MainViews/newsSection"
import { VStack, HStack } from "@/app/Components/components";
import { moveDivToIndex } from "./Components/floatingbar";
import BlurOverlay from "@/app/Components/blurOverlay";


export default function Home() {
  const [targets, setTargets] = useState([
    { id: 1, name: "Home", isSelected: true, icon: <HomeIcon className="w-5 h-5" /> },
    { id: 2, name: "Portfolio", isSelected: false, icon: <PortfolioIcon className="w-5 h-5" /> },
    { id: 3, name: "News", isSelected: false, icon: <NewsIcon className="w-5 h-5" /> },
  ]);


  const buttonRefs = useRef<HTMLButtonElement[]>([]); // stable array of refs
  const active = targets.find((t) => t.isSelected)?.name ?? "Home";
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  return (
    <main className="flex items-top justify-center min-h-screen bg-background">
      <FloatingBar targets={targets} setTargets={setTargets} buttonRefs={buttonRefs} position={position} setPosition={setPosition} />

      <VStack className="w-full items-center mx-3">
        {active === "Home" && <HomeSection />}
        {active === "Portfolio" && <PortfolioSection />}
        {active === "News" && <NewsSection />}

        <VStack className="my-20 md:text-[15px] sm:text-[15px] text-[10px]">
          <HStack className="justify-center">
            {targets.map((target, i) => (
              <button
                key={target.id}
                type="button"
                onClick={
                  () => moveDivToIndex({ index: i, setPosition, setTargets })
                }
                className="cursor-pointer"
              >
                <HStack>
                  <p className="text-sub2">
                    {target.name}
                  </p>
                  {(i != 2) && <p className="text-sub2 mx-1">|</p>}
                </HStack>
              </button>
            ))}
          </HStack>
          <p className="text-sub2">
            © 2025 Garrett Butchko. All rights reserved.
          </p>
        </VStack>
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

    </main >
  );
}
