import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { HStack, Text } from "../Components/components";
import { motion } from "framer-motion";


type Target = {
  id: number;
  name: string;
  isSelected: boolean;
  icon: React.ReactElement;
};

type FloatingBarProps = {
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  buttonRefs: React.RefObject<HTMLButtonElement[]>;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
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

  if (window.innerWidth < 768) {
    if (index === 0) x = -68;
    else if (index === 1) x = 0;
    else if (index === 2) x = 68;
  } else {
    if (index === 0) x = -168;
    else if (index === 1) x = 0;
    else if (index === 2) x = 168;
  }

  const y = 0;

  // Update position only if changed
  setPosition(prev => (prev.x === x && prev.y === y ? prev : { x, y }));

  // Update selection only if changed
  setTargets(prev => {
    const newTargets = prev.map((t, i) => ({ ...t, isSelected: i === index }));
    const isDifferent = newTargets.some((t, i) => t.isSelected !== prev[i].isSelected);
    return isDifferent ? newTargets : prev;
  });
}

export function FloatingBar({
  targets,
  setTargets,
  buttonRefs,
  position,
  setPosition,
}: FloatingBarProps) {
  // mover size (same as you used style height/width)
  const [moverSize, setMoverSize] = useState({ width: 120, height: 36 });
  

  useLayoutEffect(() => {
    moveDivToIndex({ index: 0, setPosition, setTargets });
  }, []);

  function moveToIsSelected() {
    const selectedIndex = targets.findIndex(t => t.isSelected);
    if (selectedIndex !== -1) moveDivToIndex({ index: selectedIndex, setPosition, setTargets });;
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
      outline outline-2 outline-sub1  
      rounded-[25px] 
 `}>
      <div
        style={{ height: moverSize.height + 16 }}
        className="
        overflow-hidden 
        flex 
        relative 
        items-center 
        justify-around 
        bg-foreground/80 
        backdrop-blur-sm 
        rounded-[25px] 
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
              onClick={ () => {
                moveDivToIndex({ index: i, setPosition, setTargets });
                window.scrollTo(0, 0);}
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
                duration-300
                cursor-pointer
                `
              }>
              <HStack spacing={8} className={`
                justify-center 
                ${target.isSelected ? "text-white" : "text-textColor"} 
                transition-all
                ease-in-out
                duration-300
                items-center`
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