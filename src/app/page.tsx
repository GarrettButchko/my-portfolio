"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VStack, HStack, Text, Section, Divider, Spacer, ZStack } from "./components";
import HomeIcon from '../../public/svg/home.svg';
import NewsIcon from '../../public/svg/news.svg';
import PortfolioIcon from '../../public/svg/portfolio.svg';
import Circle from '../../public/svg/circle.svg';
import { FloatingBar } from "./floatingbar";
import Image from "next/image";

type InfoItem = {
  id: number;
  title: string;
  majorOrEmployer: string;
  loc: string;
  start: number | string;
  end: number | string;
  in: boolean;
  //pic: React.ReactElement;
};

export default function Home() {
  const [targets, setTargets] = useState([
    { id: 1, name: "Home", isSelected: true, icon: <HomeIcon className="w-5 h-5" /> },
    { id: 2, name: "Portfolio", isSelected: false, icon: <PortfolioIcon className="w-5 h-5" /> },
    { id: 3, name: "News", isSelected: false, icon: <NewsIcon className="w-5 h-5" /> },
  ]);

  return (
    <main className="flex items-top justify-center min-h-screen bg-background">
      <FloatingBar targets={targets} setTargets={setTargets} />
      <VStack className="mt-24 mb-5 w-full max-w-4xl mx-4" spacing={26}>
        <Intro />
        <EduExp />
      </VStack>
    </main>
  );

  function EduExp() {




    const education: InfoItem[] = [
      { id: 1, title: "Saint Ignatius Highschool", majorOrEmployer: "Highschool", loc: "Cleveland, OH", start: 20, end: 24, in: false, },
      { id: 2, title: "Ohio State University", majorOrEmployer: "CS & Engineering", loc: "Columbus, OH", start: 24, end: 25, in: false },
      { id: 3, title: "Cleveland State University", majorOrEmployer: "CS & Design", loc: "Cleveland, OH", start: 25, end: "Pres.", in: true }
    ];

    const experience = ([
      { id: 1, title: "Web and App Developer Intern", majorOrEmployer: "CS & ADollarClass", loc: "Remote", start: 25, end: "Pres.", in: true }
    ]);

    return (
      <Section className="bg-foreground rounded-[25px] max-w-4xl shadow-lg items-center py-5">
        <VStack>
          <p
            className="
              md:text-5xl 
              sm:text-4xl 
              text-3xl 
              font-bold 
              transition-all
              ease-in-out
              duration-200
              text-left
              text-blue-500
            ">
            Education
          </p>
          <VStack>
            {education.map((student: InfoItem, index) => (
              <p>s</p>
            ))}
          </VStack>

          <p
            className="
                md:text-5xl 
                sm:text-4xl 
                text-3xl 
                font-bold 
                transition-all
                ease-in-out
                duration-200
                text-left
                text-blue-500
                ">
            Experience
          </p>
          <VStack>


          </VStack>

        </VStack>
      </Section>
    );
  }

  function InfoCollection(infoItem: InfoItem) {
    return (
      <p>
        J
      </p>
    );
  }

  function Intro() {
    return (
      <Section className="bg-foreground rounded-[25px] max-w-4xl shadow-lg items-center py-5">
        <div className="flex sm:flex-row flex-col items-center justify-center gap-5">
          <VStack className="items-left">
            <p className="font-bold text-textColor">
              👋 Hi, I'm
            </p>
            <motion.p
              className="
                md:text-5xl 
                sm:text-4xl 
                text-3xl 
                font-bold 
                bg-clip-text 
                text-transparent 
                bg-[length:200%_200%] 
                transition-all
                ease-in-out
                duration-200
                text-center"
              animate={{ backgroundPositionY: ["0%", "100%", "0%"] }}
              transition={{ duration: 0.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                backgroundImage: "linear-gradient(to bottom, #0073ffff, #00eeffff)", // blue-400 → teal-300
              }}
            >
              Garrett Butchko
            </motion.p>
          </VStack>
          <Spacer className="hidden sm:block" />
          <div className="rounded-full">
            <Image
              src="/profile.jpeg"     // path from /public
              alt="My profile picture"
              width={150}            // required
              height={150}           // required
              className="rounded-full border-7 border-oppbackground/10 shadow-lg"
            />
          </div>
        </div>

        <VStack className="items-center mt-5" spacing={8}>
          <p className="text-sub2 text-center text-bold">
            UI/UX Designer | Web & App Developer
          </p>
          <div className="flex flex-col sm:flex-row items-center" style={{ gap: `8px` }}>
            <button
              type="button"
              className={`
                  z-20 
                  rounded-[25px]
                  active:scale-95 
                  transition-all
                  ease-in-out
                  duration-300
                  bg-blue-500
                  hover:bg-blue-600
                  h-8
                  w-40
                  `}>
              <Text
                variant="body"
                className="
                  justify-center 
                  text-white
                  transition-all
                  ease-in-out
                  duration-300
                  items-center
                  ">
                Contact
              </Text>
            </button>
            <HStack spacing={8}>
              <button className="
                  overflow-hidden 
                  rounded-[5px]
                  hover:brightness-75
                  active:scale-95 
                  transition-all
                  ease-in-out
                  duration-300
                ">
                <Image
                  src="/linkedin.jpg"
                  alt="LinkedIn Picture"
                  width={32}
                  height={32}
                />
              </button>
              <button className="
                  overflow-hidden 
                  rounded-[5px]
                  hover:brightness-75
                  active:scale-95 
                  transition-all
                  ease-in-out
                  duration-300
                ">
                <Image
                  src="/github.jpg"     // path from /public
                  alt="Github Picture"
                  width={32}
                  height={32}
                />
              </button>
            </HStack>
          </div>
        </VStack>
      </Section>
    );
  }
}
