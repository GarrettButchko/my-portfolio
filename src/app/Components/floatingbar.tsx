import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { HStack, Text } from "./Components";
import { motion } from "framer-motion";

type Target = {
  id: number;
  name: string;
  isSelected: boolean;
  icon: React.ReactElement;
};

type FloatingBarProps = {
  targets: Target[];
  buttonRefs: React.RefObject<HTMLButtonElement[]>;
  onSectionChange: (sectionName: string, index: number) => void; // 👈 new prop
};

export interface MoveDivToIndexOptions<T> {
  index: number;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setTargets: React.Dispatch<React.SetStateAction<T[]>>;
}

export function moveDivToIndex<T extends { isSelected: boolean }>(
  { index, setPosition, setTargets }: MoveDivToIndexOptions<T>
) {
  let x = 0;

  if (typeof window !== "undefined") {
    if (window.innerWidth < 768) {
      if (index === 0) x = -68;
      else if (index === 1) x = 0;
      else if (index === 2) x = 68;
    } else {
      if (index === 0) x = -168;
      else if (index === 1) x = 0;
      else if (index === 2) x = 168;
    }
  }

  const y = 0;

  setPosition(prev => (prev.x === x && prev.y === y ? prev : { x, y }));

  setTargets(prev => {
    const newTargets = prev.map((t, i) => ({ ...t, isSelected: i === index }));
    const isDifferent = newTargets.some((t, i) => t.isSelected !== prev[i].isSelected);
    return isDifferent ? newTargets : prev;
  });
}

export function FloatingBar({
  targets,
  buttonRefs,
  onSectionChange,
}: FloatingBarProps) {
  const [moverSize, setMoverSize] = useState({ width: 160, height: 36 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false); // client-only flag

  // Compute initial size and position on mount
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Set size based on screen width
    if (window.innerWidth < 768) setMoverSize({ width: 60, height: 36 });
    else setMoverSize({ width: 160, height: 36 });

    // Set position based on selected index
    const selectedIndex = targets.findIndex(t => t.isSelected) ?? 0;
    let x = 0;
    if (window.innerWidth < 768) {
      if (selectedIndex === 0) x = -68;
      else if (selectedIndex === 1) x = 0;
      else if (selectedIndex === 2) x = 68;
    } else {
      if (selectedIndex === 0) x = -168;
      else if (selectedIndex === 1) x = 0;
      else if (selectedIndex === 2) x = 168;
    }

    setPosition({ x, y: 0 });
    setMounted(true);
  }, [targets]);

  // Handle resize dynamically
  useEffect(() => {
    const handleResize = () => {
      // Update mover size responsively
      if (window.innerWidth < 768) setMoverSize({ width: 60, height: 36 });
      else setMoverSize({ width: 160, height: 36 });

      // Recalculate mover position based on the selected index
      const selectedIndex = targets.findIndex(t => t.isSelected);
      if (selectedIndex !== -1) {
        let x = 0;
        if (window.innerWidth < 768) {
          if (selectedIndex === 0) x = -68;
          else if (selectedIndex === 1) x = 0;
          else if (selectedIndex === 2) x = 68;
        } else {
          if (selectedIndex === 0) x = -168;
          else if (selectedIndex === 1) x = 0;
          else if (selectedIndex === 2) x = 168;
        }
        setPosition({ x, y: 0 });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targets]);


  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }} // slide/fade in
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="fixed top-5 z-50 left-1/2 -translate-x-1/2 w-fit outline outline-2 outline-sub1 rounded-[25px]"
    >
      <div
        style={{ height: moverSize.height + 16 }}
        className="overflow-hidden flex relative items-center justify-around bg-foreground/80 backdrop-blur-sm rounded-[25px] py-2 px-2 transition-all ease-in-out duration-300"
      >
        {/* Animated mover */}
        <motion.div
          initial={false} // prevent mover from animating from 0,0
          animate={{
            x: position.x,
            y: position.y,
            width: moverSize.width,
            height: moverSize.height,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
          className="absolute z-0 rounded-[18px] bg-accent pointer-events-none"
          style={{ width: moverSize.width, height: moverSize.height }}
        />

        <HStack className="z-10" spacing={8}>
          {targets.map((target, i) => (
            <button
              key={target.id}
              ref={el => { if (el) buttonRefs.current[i] = el; }}
              onClick={() => {

                onSectionChange(target.name, i);
              }}
              style={{ width: moverSize.width, height: moverSize.height }}
              className={`z-20 rounded-[18px] ${target.isSelected ? "" : "active:scale-95 hover:bg-oppbackground/5"} transition-all ease-in-out duration-300 cursor-pointer`}
            >
              <HStack
                spacing={8}
                className={`justify-center ${target.isSelected ? "text-white" : "text-textColor"} transition-all ease-in-out duration-300 items-center`}
              >
                {target.icon}
                <Text variant="body" className="hidden md:flex">
                  {target.name}
                </Text>
              </HStack>
            </button>
          ))}
        </HStack>
      </div>
    </motion.div>
  );
}
