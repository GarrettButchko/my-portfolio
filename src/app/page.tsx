"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VStack, HStack, Text, Section, Divider, Spacer, ZStack } from "./components";

export default function Home() {
  return (
    <main className="flex items-top justify-center min-h-screen bg-background ">
      <FloatingBar />
      <VStack className="w-full max-w-3xl bg-foreground mt-30 rounded-t-[25px]">
        <Section className="my-20">
          <VStack className="items-start" spacing={8}>
            <Text variant="title" className="text-oppforeground">Welcome to My Portfolio</Text>
            <Divider borderColor="border-oppforeground" />
            <Text variant="body" className="text-oppforeground">
              This is a sample portfolio page with a floating navigation bar.
            </Text>
          </VStack>
        </Section>
      </VStack>
    </main>
  );
}


function FloatingBar() {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className={`
   fixed top-6 z-50
   right-6
   md:left-1/2 
   md:-translate-x-1/2 
   md:right-auto
   w-fit              
 `}>
      <WideScreenBar />


      {/* Mobile Toggle Button */}
      <div className="
     md:hidden
     bg-foreground/80
     backdrop-blur-md
     rounded-[25px]
     overflow-hidden
     p-[8px]
     gap-[8px]
     shadow-md
     "
      >
        <VStack>
          {isOpen ? <FloatingBarButton label="C" action={() => setIsOpen(false)} /> : <FloatingBarButton label="O" action={() => setIsOpen(true)} />}
          {/* Mobile Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <VStack
                key="dropdown"
                initial={{ height: 0, y: -10, width: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: "auto", y: 0, width: "auto", opacity: 1, scale: 1 }}
                exit={{ height: 0, y: -10, width: 0, opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  mass: 0.5
                  // smooth cubic-bezier easing
                }}
                radius={17}
                spacing={8}
              >
                <Spacer />
                <Divider borderColor="border-oppforeground" />
                <FloatingBarButton label="H" />
                <FloatingBarButton label="P" />
                <FloatingBarButton label="H" />
              </VStack>
            )}
          </AnimatePresence>
        </VStack>
      </div>
    </div>
  );
}


function FloatingBarButton({ label = "", action, className = "", white = true }: { label?: string; action?: () => void; className?: string, white?: boolean }) {
  return (
    <button
      onClick={action}
      className={className}
    >
      {/* eslint-disable-next-line react/no-children-prop */}
      <Text children={label} variant="body" />
    </button>
  );
}

function WideScreenBar() {
  // mover size (same as you used style height/width)
  const MOVER_WIDTH = 160;
  const MOVER_HEIGHT = 40;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const barRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]); // stable array of refs

  // target definitions (only contains names/ids — refs are stored in buttonRefs)
  const [targets, setTargets] = useState([
    { id: 1, name: "Home", isSelected: true },
    { id: 2, name: "Portfolio", isSelected: false },
    { id: 3, name: "News", isSelected: false },
  ]);


  // compute position of a button relative to the bar container
  const moveDivToIndex = (index: number) => {
    const btn = buttonRefs.current[index];
    const bar = barRef.current;
    if (!btn || !bar) return;

    const btnRect = btn.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();

    // Put mover centered under the button horizontally, vertically centered in the bar
    const x = btnRect.left - barRect.left - btnRect.width - 8;
    const y = barRect.height - barRect.bottom + (btnRect.height / 2) + 4;

    setPosition({ x, y });
    setTargets(prev => prev.map((t, i) => ({...t, isSelected: i === index})));
  };

  // Set initial position to the first button after mount
  useLayoutEffect(() => {
    // ensure refs are populated
    if (buttonRefs.current[0] && barRef.current) {
      moveDivToIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={barRef}
      className="hidden md:flex relative items-center justify-around h-14 bg-foreground/80 backdrop-blur-md rounded-[25px] shadow-md py-4 px-2"
    // the motion child will be absolutely positioned inside this container
    >
      {/* animated mover — absolutely positioned inside the bar */}
      <motion.div
        className="absolute z-0 rounded-[18px] bg-blue-500 y-[-50px]"
        animate={{ x: position.x, y: position.y }}
        transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  mass: 0.5
                  // smooth cubic-bezier easing
                }}
        style={{
          height: MOVER_HEIGHT,
          width: MOVER_WIDTH,
          pointerEvents: "none", // let clicks pass to buttons
        }}
      />

      <HStack className="z-10">
        {targets.map((target, i) => (
          <button
            key={target.id}
            type="button"
            ref={(el) => {
              if (el) buttonRefs.current[i] = el;
            }}
            onClick={() => moveDivToIndex(i)}
            className={`w-40 z-20 py-2 ${target.isSelected ? "" : "active:scale-95"}`}
          >
            <Text variant="body" className={`${target.isSelected ? "text-white" : "text-oppforeground"} transition-all ease-in-out duration-300`}>
              {target.name}
            </Text>
          </button>
        ))}
      </HStack>
    </div>
  );
}