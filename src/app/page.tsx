"use client";

import React, {useState } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { VStack, HStack, Button, Text, Section, Divider, Spacer } from "./components";

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
      {/* Desktop / Horizontal Bar */}
        <HStack className="
        hidden
        md:flex
        items-center
        justify-around
        h-14
        bg-foreground/80
        backdrop-blur-md
        rounded-[25px]
        overflow-hidden
        p-[8px]
        shadow-md
        ">

          <Button className="w-40">
            <Text variant="body" className="text-oppforeground">
              Home
            </Text>
          </Button>
          <Button className="w-40">
            <Text variant="body" className="text-oppforeground">
              Portfolio
            </Text>
          </Button>
          <Button className="w-40">
            <Text variant="body" className="text-oppforeground">
              News
            </Text>
          </Button>
        </HStack>


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
    <Button
      action={action}
      radius={17}
      className={className}
    >
      {/* eslint-disable-next-line react/no-children-prop */}
      <Text children={label} variant="body" />
    </Button>
  );
}


