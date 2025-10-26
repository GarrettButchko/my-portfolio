"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VStack, HStack, Text, Section, Divider, Spacer, ZStack } from "./components";
import HomeIcon from '../../public/home.svg';
import NewsIcon from '../../public/news.svg';
import PortfolioIcon from '../../public/portfolio.svg';



export default function Home() {

  

  return (
    <main className="flex items-top justify-center min-h-screen bg-background">
      <FloatingBar />

      <VStack className="mt-24 mb-5 w-full max-w-3xl mx-4" spacing={26}>
        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>

        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>

        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>
        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>

        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>
        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>
        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>
        <Section className="bg-foreground rounded-[25px] shadow-lg">
          <VStack className="items-start my-20" spacing={8}>
            <Text variant="title" className="text-textColor">Welcome to My Portfolio</Text>
            <Divider borderColor="border-textColor" />
            <Text variant="body" className="text-textColor">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>

      </VStack>
    </main>
  );
}

function FloatingBar() {
  // mover size (same as you used style height/width)
  const [moverSize, setMoverSize] = useState({ width: 120, height: 36 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const barRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]); // stable array of refs

  // target definitions (only contains names/ids — refs are stored in buttonRefs)
  const [targets, setTargets] = useState([
    { id: 1, name: "Home", isSelected: true, icon: <HomeIcon className="w-5 h-5" /> },
    { id: 2, name: "Portfolio", isSelected: false, icon: <PortfolioIcon className="w-5 h-5" /> },
    { id: 3, name: "News", isSelected: false, icon: <NewsIcon className="w-5 h-5" /> },
  ]);

  // compute position of a button relative to the bar container
  const moveDivToIndex = (index: number) => {
    const btn = buttonRefs.current[index];
    const bar = barRef.current;
    if (!btn || !bar) return;

    const btnRect = btn.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();

    var x = 0;
    
    if (window.innerWidth < 768) {
      if (index == 0) {
        x = -68;
      } else if (index == 1) {
        x = 0;
      } else if (index == 2){
        x = 68;
      }
    } else {
      if (index == 0) {
        x = -168;
      } else if (index == 1) {
        x = 0;
      } else if (index == 2){
        x = 168;
      }
    }

    // old wayconst x = (btnRect.right + btnRect.left) / 2 - (barRect.left + barRect.right) / 2;
    const y = (btnRect.top + btnRect.bottom) / 2 - (barRect.top + barRect.bottom) / 2;

    // Only update if different
    setPosition(prev => (prev.x === x && prev.y === y ? prev : { x, y }));

    setTargets(prev => {
      const newTargets = prev.map((t, i) => ({ ...t, isSelected: i === index }));
      // Only update if changed
      const isDifferent = newTargets.some((t, i) => t.isSelected !== prev[i].isSelected);
      return isDifferent ? newTargets : prev;
    });
  };

  useLayoutEffect(() => {
    moveDivToIndex(0); // set initial position instantly
  }, []);

  function moveToIsSelected() {
    const selectedIndex = targets.findIndex(t => t.isSelected);
    if (selectedIndex !== -1) moveDivToIndex(selectedIndex);
  }


  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) { // max-w-3xl = 48rem = 768px
        setMoverSize({ width: 60, height: 36 }); // new smaller size
        moveToIsSelected();
      } else {
        setMoverSize({ width: 160, height: 36 }); // default size
        moveToIsSelected();
      }
    }
    handleResize(); // set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targets]);

  return (
    <div className={`
      fixed
      top-5 
      z-50
      left-1/2 
      -translate-x-1/2 
      right-auto
      w-fit   
 `}>
      <div
        ref={barRef}
        style={{ height: moverSize.height + 16 }}
        className="
        overflow-hidden 
        flex 
        relative 
        items-center 
        justify-around 
        bg-foreground/80 
        backdrop-blur-md 
        rounded-[25px] 
        shadow-md 
        py-2 
        px-2 
        transition-all
        ease-in-out
        duration-300"
      >
        {/* animated mover — absolutely positioned inside the bar */}
        <motion.div
          className="absolute z-0 rounded-[18px] bg-blue-500 y-[-50px]"
          animate={{ x: position.x, y: position.y, width: moverSize.width, height: moverSize.height}}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
            mass: 0.5,
          }}
          style={{
            height: moverSize.height,
            width: moverSize.width,
            pointerEvents: "none", // let clicks pass to buttons
          }}
          onAnimationComplete={() => {
            moveToIsSelected();
          }}
        />

        <HStack className="z-10" spacing={8}>
          {targets.map((target, i) => (
            <button
              key={target.id}
              type="button"
              //animate={{backgroundColor: --oppbackground}}
              ref={(el) => {
                if (el) buttonRefs.current[i] = el;
              }}
              onClick={
                () => moveDivToIndex(i)
              }
              style={{
                width: moverSize.width,
                height: moverSize.height
              }}
              className={`
                z-20 
                rounded-[18px]
                ${target.isSelected ? "" : "active:scale-95 hover:bg-oppbackground/5"} 
                transition-all
                ease-in-out
                duration-300`
              }>
              <HStack spacing={8} className={`
                justify-center 
                ${target.isSelected ? "text-white" : "text-textColor"} 
                transition-all
                ease-in-out
                duration-300`
              }>
                {target.icon}
                <Text variant="body" className="
                hidden 
                md:flex 
                ">
                  {target.name}
                </Text>
              </HStack>
            </button>
          ))}
        </HStack>
      </div>
    </div>
  );
}