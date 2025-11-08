"use client";

import { VStack, HStack, Text, Section, Divider, Spacer, ZStack } from "../Components/components";
import Circle from "../../../public/svg/circle.svg";
import Image from "next/image";
import { hexToRgba } from "@/app/lib/hextoRgba";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Project } from "@/app/Types/Project"
import { ProjSection, ProjSectionPlaceHolder } from "@/app/Components/projectSection";

export default function HomeSecton() {

  return (
    <VStack className="mt-40 mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px]" spacing={45}>
      <Intro />
      <div className="flex bg-sub1 h-[3px] mx-6 rounded-[2px]" />
      <EduExp />
      <div className="flex bg-sub1 h-[3px] mx-6 rounded-[2px]" />
      <RecProj />
    </VStack>
  );

  function RecProj() {
    const [loading, setLoading] = useState(true);

    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
      // prevent running before localStorage is available (server-side)
      if (typeof window === "undefined") return;

      const cached = localStorage.getItem("projects");
      if (cached) {
        setProjects(JSON.parse(cached));
        setLoading(false);
      }

      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          const cachedData = cached ? JSON.parse(cached) : null;

          // Only update if data actually changed
          if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
            setProjects(data);
            localStorage.setItem("projects", JSON.stringify(data));
          }
        })
        .catch((err) => console.error("Error loading projects:", err))
        .finally(() => setLoading(false));

    }, []); // ✅ empty dependency array runs once only


    return (
      <Section className="max-w-4xl items-center py-5">
        <VStack spacing={25}>
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
            Featured Projects
          </p>

          <VStack className="w-full max-w-4xl bg-foreground rounded-[30px]" spacing={45}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {loading ? (
                <>
                  <ProjSectionPlaceHolder />
                  <ProjSectionPlaceHolder />
                </>
              ) : (
                <>
                  {projects
                    .filter((p) => p.feature)
                    .map((p, i) => (
                      <ProjSection key={i} project={p} index={i} />
                    ))}
                </>
              )}
            </div>
          </VStack>
        </VStack>
      </Section >
    );
  }

  function Intro() {
    return (
      <Section className="max-w-4xl items-center pt-20 py-5">
        <div className="flex sm:flex-row flex-col items-center justify-center gap-5">
          <VStack className="sm:items-start items-center">
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
            <div className="flex flex-col sm:flex-row text-sub2 font-bold mt-1 
                md:text-[20px] 
                sm:text-[17px]
                text-[15px]
                items-center">
              <p>
                UI/UX Designer
              </p>
              <p className="hidden sm:flex px-1">
                |
              </p>
              <p>
                Web & App Developer
              </p>
            </div>

          </VStack>
          <Spacer className="hidden sm:block w-1" />
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
      <Section className="max-w-4xl items-center py-6">
        <VStack spacing={25}>
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
              <InfoCollection key={index} infoItem={student} index={index} />
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
                <InfoCollection key={index} infoItem={job} index={index} />
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Section>
    );
  }

  function InfoCollection({ infoItem, index }: { infoItem: InfoItem, index: number }) {

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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.2 }} // triggers when 20% visible, only once
          className="flex flex-col items-center w-full">
          <div style={{ outlineColor: hexToRgba(infoItem.hexColor, 0.2) }} className="flex md:flex-row flex-col rounded-[24px] bg-sub1 p-6 justify-center items-center gap-2 w-full outline outline-2">
            <VStack className="md:items-start items-center justify-center">
              <div className="flex sm:flex-row flex-col justify-center items-center 
            text-[12px] sm:text-[15px] md:text-[18px]">
                <p className="font-bold text-sub2 justify-center">
                  {infoItem.majorOrEmployer}
                </p>
                <p className="font-bold text-sub2 hidden sm:flex px-1">
                  |
                </p>
                <p className="font-bold text-sub2 justify-center">
                  {infoItem.loc} | '{infoItem.start} - {typeof infoItem.end === "string" ? infoItem.end : `'${infoItem.end}`}
                </p>
              </div>

              <p
                className="
            md:text-[30px]
            sm:text-[30px]
            xs:text-[15px] 
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
            <button className="cursor-pointer mb-3 md:mb-0" onClick={() => window.open(infoItem.link, "_blank")}>
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
        </motion.div>
      </HStack>
    );
  }
}

