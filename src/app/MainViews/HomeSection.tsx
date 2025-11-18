"use client";

import { VStack, HStack, Text, Section, Spacer } from "../Components/Components";
import InfoCollection from "../Components/InfoCollection";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { Project, InfoItem } from "@/app/types"
import { ProjSection, ProjSectionPlaceHolder } from "@/app/Components/ProjectSection";
import BlurOverlay from "@/app/Components/BlurOverlay";
import { PicView } from "../Components/PicView";



export default function HomeSecton() {

  const [show, setShow] = useState(false);
  const popUpView = useRef<React.ReactNode>(
    <div className="text-textColor text-center font-bold">
      Nothing Here Yet :)...
    </div>
  );

   useEffect(() => {
          document.title = `Home | GB Portfolio`;
      });

  useEffect(() => {
    if (show) {
      // Lock scroll and save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflowY = "scroll";
      document.body.style.width = "100%";

      return () => {
        // Restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflowY = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [show]);

  return (
    <div className="w-full flex justify-center mt-40 mx-3 md:mx-6">
      <VStack className="w-full max-w-4xl bg-foreground rounded-[30px]">
        <Intro />
        <div className="flex bg-sub1 h-[3px] mx-6 rounded-[2px]" />
        <EduExp />
        <div className="flex bg-sub1 h-[3px] mx-6 rounded-[2px]" />
        <RecProj />
      </VStack>
      <BlurOverlay show={show} onClose={() => setShow(false)} >
        {popUpView.current}
      </BlurOverlay>
    </div>
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
      <Section className="w-full items-center py-5">
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
              text-accent
            ">
            Featured Projects
          </p>

          <VStack className="bg-foreground rounded-[30px] mb-1" spacing={45}>
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
                      <ProjSection key={p.title} project={p} index={i} setShow={setShow} view={popUpView} />
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
      <Section className="items-center pt-20 py-5">
        <div className="flex sm:flex-row flex-col items-center justify-center gap-5">
          <VStack className="sm:items-start items-center">
            <p className="font-bold text-textColor">
              👋 Hi, I&apos;m
            </p>

            <motion.p
              className="
                md:text-5xl
                sm:text-4xl
                text-3xl
                font-bold
                bg-clip-text
                text-transparent
                bg-[linear-gradient(to_top,theme('colors.accent'),theme('colors.accent'),theme('colors.accent'))]
                bg-[length:400%_200%]
                transition-all
                ease-in-out
                duration-100
                text-center
            "
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
              className="rounded-full border-7 border-oppbackground/10 cursor-pointer"
              onClick={() => {
                setShow(true);
                popUpView.current = <PicView profile={"/profile.jpeg"} />
              }}
            />
          </div>
        </div>

        <VStack className="items-center mt-5" spacing={8}>

          <div className="flex flex-col sm:flex-row items-center" style={{ gap: `8px` }}>
            <motion.button
              whileHover={{ scale: 1.06 }} transition={{ duration: 0.03 }}
              title="Email Me!"
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
                  bg-accent hover:brightness-75
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
            </motion.button>
            <HStack spacing={8}>
              <motion.button
                whileHover={{ scale: 1.06 }} transition={{ duration: 0.03 }}
                title="Go to my Linkedin"
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
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }} transition={{ duration: 0.03 }}
                className="
                  overflow-hidden 
                  rounded-[5px]
                  hover:brightness-75
                  active:scale-95 
                  transition-all
                  ease-in-out
                  duration-300
                  cursor-pointer
                "
                title="Go to my Github"
                onClick={() => window.open("https://github.com/GarrettButchko", "_blank")}
              >
                <Image
                  src="/github.jpg"     // path from /public
                  alt="Github Picture"
                  width={32}
                  height={32}
                />
              </motion.button>
            </HStack>
          </div>
        </VStack>
      </Section>
    );
  }

  function EduExp() {

    const education: InfoItem[] = [
      {
        id: 1,
        title: "Saint Ignatius Highschool",
        majorOrEmployer: "Highschool",
        gpa: 4.31,
        loc: "Cleveland, OH",
        start: 20,
        end: 24,
        in: false,
        pic: "/logos/sihs.jpg",
        picAlt: "Saint Ignatius Highschool Logo",
        hexColor: "#eab908",
        link: "https://www.ignatius.edu/",
        actProjs: [
          {
            title: "Student Government",
            body: "Participated in student council, organizing events and representing student interests.",
            skills: ["Leadership", "Event Planning", "Teamwork"],
          },
          {
            title: "Football (Varsity Captain)",
            body: "Captain of the varsity football team, leading teammates and contributing to team strategy and success.",
            skills: ["Leadership", "Teamwork", "Strategy"],
          },
          {
            title: "Rugby (Varsity, 3 years)",
            body: "Played varsity rugby for three years; 1 National Championship, 1 State Runner-Up, and 3 State Championships.",
            skills: ["Teamwork", "Strategy", "Discipline", "Competitive Mindset"],
          },
          {
            title: "Big Brother",
            body: "Mentored younger students, providing guidance and support throughout the school year.",
            skills: ["Mentorship", "Communication", "Responsibility"],
          },
          {
            title: "Freshman Retreat Leader",
            body: "Led retreats for incoming freshmen, organizing activities and fostering community.",
            skills: ["Leadership", "Organization", "Public Speaking"],
          },
          {
            title: "Welsch Academy Flag Football Coach",
            body: "Coached youth flag football, teaching fundamentals and teamwork to younger players.",
            skills: ["Coaching", "Leadership", "Motivation"],
          },
        ]
      },
      {
        id: 2,
        title: "Ohio State University",
        majorOrEmployer: "CS & Engineering",
        gpa: 3.2,
        loc: "Columbus, OH",
        start: 24,
        end: 25,
        in: false,
        pic: "/logos/osu.jpg",
        picAlt: "Ohio State Logo",
        hexColor: "#bb0000",
        link: "https://www.osu.edu/",
        actProjs: [
          {
            title: "Impact Developers Club",
            body: "Founded and lead the Impact Developers Club, overseeing development projects and mentoring members to build real-world applications that serve the community.",
            skills: ["Leadership", "Project Management", "Software Development", "Mentorship"],
          },
          {
            title: "Honors Community Leadership Council",
            body: "Member of the council, contributing to initiatives that enhance community engagement and leadership among students.",
            skills: ["Leadership", "Community Engagement", "Collaboration", "Event Planning"],
          },
        ]
      },
      {
        id: 3,
        title: "Cleveland State University",
        majorOrEmployer: "CS & Design",
        gpa: "TBD",
        loc: "Cleveland, OH",
        start: 25,
        end: "Pres.",
        in: true,
        pic: "/logos/csu.jpg",
        picAlt: "Cleveland State Logo",
        hexColor: "#016a4c",
        link: "https://www.csuohio.edu/",
        actProjs: [
          {
            title: "Viking Catholic",
            body: "Manage the finances of Viking Catholic, overseeing budgets, coordinating fundraising, and supporting leadership in organizing campus events.",
            skills: ["Financial Management", "Budgeting", "Organization", "Leadership"],
          },
        ]
      }
    ];

    const experience: InfoItem[] = ([
      {
        id: 1,
        title: "Web and App Dev. Intern",
        majorOrEmployer: "ADollarClass",
        loc: "Remote",
        start: 25,
        end: "Pres.",
        in: true,
        pic: "/logos/adollarclass.jpg",
        picAlt: "AdollarClass Company Logo",
        hexColor: "#022ffe",
        link: "https://www.adollarclass.com/",
        actProjs: [
          {
            title: "Mobile App",
            body: "Completed hands-on training by developing a full-stack mobile application to gain experience in app architecture, UI design, and backend integration.",
            skills: ["App Development", "Flutter", "Firebase", "UI Design", "Problem Solving", "Team Collaboration"],
          }
        ]
      }
    ]);

    return (
      <Section className="w-full items-center py-6">
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
              text-accent
            ">
            Education
          </p>

          <VStack spacing={25}>
            {education.map((student: InfoItem, index) => (
              <InfoCollection key={student.title + index} infoItem={student} popUpView={popUpView} setShow={setShow} />
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
                text-accent
                ">
            Experience
          </p>
          <VStack>
            <VStack spacing={25}>
              {experience.map((job: InfoItem, index) => (
                <InfoCollection key={job.id + index} infoItem={job} popUpView={popUpView} setShow={setShow} />
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Section>
    );
  }
}

