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
import { info } from "console";
import { hexToRgba } from "@/app/hextoRgba";


type InfoItem = {
  id: number;
  title: string;
  majorOrEmployer: string;
  loc: string;
  start: number | string;
  end: number | string;
  in: boolean;
  pic: string;
  picAlt: string;
  hexColor: string;
  link: string;
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
      <VStack className="mt-40 mb-6 mx-6 w-full max-w-4xl" spacing={45}>
        <Intro />
        <EduExp />
        <RecProj/>
      </VStack>
    </main>
  );

  function RecProj() {
    return (
      <Section className="bg-foreground rounded-[30px] max-w-4xl items-center py-6">
        
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
            Recent Projects

            <HStack>
              
            </HStack>
          </p>
          </VStack>
      </Section>
    );
  }

  function Intro() {
    return (
      <Section className="bg-foreground rounded-[30px] max-w-4xl items-center py-5">
        <div className="flex sm:flex-row flex-col items-center justify-center gap-5">
          <VStack className="sm:items-start items-center">
            <p className="font-bold text-textColor">
              👋 Hi, I'm
            </p>
            <motion.p
              className="
                md:text-5xl 
                text-4xl 
                font-bold 
                bg-clip-text
                text-transparent 
                bg-[length:400%_200%] 
                transition-all
                ease-in-out
                duration-100
                text-center"
              animate={{ backgroundPositionX: ["0%", "100%", "0"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                backgroundImage: "linear-gradient(to top, #0073ffff, #00bfffff, #0073ffff)", // blue-400 → teal-300
              }}
            >
              Garrett Butchko
            </motion.p>
            <p className="text-sub2 font-bold mt-1">
              UI/UX Designer | Web & App Developer
            </p>
          </VStack>
          <Spacer className="hidden sm:block" />
          <div className="rounded-full">
            <Image
              src="/profile.jpeg"     // path from /public
              alt="My profile picture"
              width={150}            // required
              height={150}           // required
              className="rounded-full border-7 border-oppbackground/10"
            />
          </div>
        </div>

        <VStack className="items-center mt-5" spacing={8}>

          <div className="flex flex-col sm:flex-row items-center" style={{ gap: `8px` }}>
            <button
              type="button"
              onClick={() =>
              (window.location.href =
                "mailto:garrettwm2005@gmail.com?subject=I'm%20interested%20in%20your%20work&body=")
              }
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
                  cursor-pointer
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
              <button
                onClick={() => window.open("https://www.linkedin.com/in/gar-butch/", "_blank")}
                className="
                  overflow-hidden 
                  rounded-[5px]
                  hover:brightness-75
                  active:scale-95 
                  transition-all
                  ease-in-out
                  duration-300
                  cursor-pointer
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
                  cursor-pointer
                "
                onClick={() => window.open("https://github.com/GarrettButchko", "_blank")}
              >
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

  function EduExp() {

    const education: InfoItem[] = [
      { id: 1, title: "Saint Ignatius Highschool", majorOrEmployer: "Highschool", loc: "Cleveland, OH", start: 20, end: 24, in: false, pic: "/logos/sihs.jpg", picAlt: "Saint Ignatius Highschool Logo", hexColor: "#eab908", link: "https://www.ignatius.edu/" },
      { id: 2, title: "Ohio State University", majorOrEmployer: "CS & Engineering", loc: "Columbus, OH", start: 24, end: 25, in: false, pic: "/logos/osu.jpg", picAlt: "Ohio State Logo", hexColor: "#bb0000", link: "https://www.osu.edu/" },
      { id: 3, title: "Cleveland State University", majorOrEmployer: "CS & Design", loc: "Cleveland, OH", start: 25, end: "Pres.", in: true, pic: "/logos/csu.jpg", picAlt: "Cleveland State Logo", hexColor: "#016a4c", link: "https://www.csuohio.edu/" }
    ];

    const experience: InfoItem[] = ([
      { id: 1, title: "Web and App Dev. Intern", majorOrEmployer: "ADollarClass", loc: "Remote", start: 25, end: "Pres.", in: true, pic: "/logos/adollarclass.jpg", picAlt: "AdollarClass Company Logo", hexColor: "#022ffe", link: "https://www.adollarclass.com/" }
    ]);

    return (
      <Section className="bg-foreground rounded-[30px] max-w-4xl items-center py-6">
        <VStack spacing={25} className="pt-2">
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

          <VStack spacing={25}>
            {education.map((student: InfoItem, index) => (
              <InfoCollection key={index} infoItem={student} />
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
            <VStack spacing={25}>
              {experience.map((job: InfoItem, index) => (
                <InfoCollection key={index} infoItem={job} />
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Section>
    );
  }

  function InfoCollection({ infoItem }: { infoItem: InfoItem }) {

    return (

      <HStack spacing={20} className="items-center ">

        <div className="md:flex hidden">
          {infoItem.in ? (
            <Circle
              className="text-sub1 fill-sub2 w-8 h-8"
              style={{ transform: "translateY(-16px)" }}
            />
          ) : (
            <HStack>
              <div>
                <Circle
                  className="text-sub1 fill-sub1 w-8 h-8"
                  style={{ transform: "translateY(56px)" }}
                />
                <div
                  className="bg-sub1 scale-150"
                  style={{ height: `${140}px`, width: `${5}px`, transform: "translateY(56px) translateX(9px)" }}
                />
              </div>
            </HStack>
          )}
        </div>

        <div className="flex flex-col items-center w-full">
          <div style={{ outlineColor: hexToRgba(infoItem.hexColor, 0.2) }} className="flex md:flex-row flex-col rounded-[24px] bg-sub1 p-6 justify-center items-center gap-2 w-full outline outline-2">
            <VStack className="md:items-start items-center justify-center">
              <p className="font-bold text-sub2">
                {infoItem.majorOrEmployer} | {infoItem.loc} | '{infoItem.start} - {typeof infoItem.end === "string" ? infoItem.end : `'${infoItem.end}`}
              </p>
              <p
                className="
            md:text-4xl 
            sm:text-3xl 
            text-2xl 
            font-bold  
            transition-all
            ease-in-out
            duration-200
            text-sub3
          ">
                {infoItem.title}
              </p>
            </VStack>
            <Spacer />
            <button className="cursor-pointer" onClick={() => window.open(infoItem.link, "_blank")}>

              <Image
                src={infoItem.pic}     // path from /public
                alt={infoItem.picAlt}
                width={100}
                height={100}
                className="rounded-full w-[100px] h-[100px] object-cover flex-shrink-0"
              />
            </button>

          </div>
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
                  cursor-pointer
                  `}
            style={{
              width: 160,
              height: 32,
              transform: "translateY(-16px)",
            }}>
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
              Learn More
            </Text>
          </button>
        </div>
      </HStack>
    );
  }
}
