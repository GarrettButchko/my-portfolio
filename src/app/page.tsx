"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VStack, HStack, Text, Section, Divider, Spacer, ZStack } from "./components";
import HomeIcon from '../../public/home.svg';
import NewsIcon from '../../public/news.svg';
import PortfolioIcon from '../../public/portfolio.svg';
import { FloatingBar } from "./floatingbar";



export default function Home() {
  const [targets, setTargets] = useState([
    { id: 1, name: "Home", isSelected: true, icon: <HomeIcon className="w-5 h-5" /> },
    { id: 2, name: "Portfolio", isSelected: false, icon: <PortfolioIcon className="w-5 h-5" /> },
    { id: 3, name: "News", isSelected: false, icon: <NewsIcon className="w-5 h-5" /> },
  ]);
  
  return (
    <main className="flex items-top justify-center min-h-screen bg-background">
      <FloatingBar targets={targets} setTargets={setTargets} />

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
      </VStack>
    </main>
  );
}
