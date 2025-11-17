

import { VStack, HStack, Text, Spacer, Divider } from "./Components";
import Circle from "../../../public/svg/circle.svg";
import Image from "next/image";
import { hexToRgba } from "@/app/lib/hextoRgba";
import { motion } from "framer-motion";
import { InfoItem, ActProj } from "../types";

export default function InfoCollection({
  infoItem,
  setShow,
  popUpView,
}: {
  infoItem: InfoItem;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  popUpView: React.RefObject<React.ReactNode>;
}) {



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
                style={{ height: "140px", width: "5px", transform: "translateY(56px) translateX(9px)" }}
              />
            </div>
          </HStack>
        )}
      </div>

      <div
        className="flex flex-col items-center w-full">
        <div style={{ outlineColor: hexToRgba(infoItem.hexColor, 0.2) }} className="flex md:flex-row flex-col rounded-[15px] bg-sub1 p-6 justify-center items-center gap-2 w-full outline outline-2">
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
                {infoItem.loc} | {infoItem.start}&apos; - {typeof infoItem.end === "string" ? infoItem.end : `${infoItem.end}'`}
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
        <motion.button
          aria-label="Open details"
          whileHover={{ scale: 1.06 }} transition={{ duration: 0.03 }}
          type="button"
          onClick={() => {
            setShow(true);
            popUpView.current = <InfoCollectionBig infoItem={infoItem} />;
          }}
          className={`
            relative
                    bottom-[16px] 
                  z-20 
                  rounded-[25px]
                  active:scale-95 
                  transition-all
                  ease-in-out
                  duration-300
                  bg-accent hover:brightness-75
                  cursor-pointer
                  px-6
                  py-1
                  `}
        >
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
        </motion.button>
      </div>
    </HStack>
  );
}

export function InfoCollectionBig({ infoItem }: { infoItem: InfoItem }) {

  return (
    <VStack className="bg-foreground rounded-[25px] p-6 w-full shadow-lg" spacing={8}>
      <HStack className="justify-center w-full items-center">
        <p className="
        absolute
        start-10
          md:text-[20px] 
          sm:text-[20px]
          text-[10px]
          text-sub3 
          font-bold
        ">
          {infoItem.start}&apos; - {typeof infoItem.end === "string" ? infoItem.end : `${infoItem.end}'`}
        </p>

        <VStack>
          <p
            style={{ color: infoItem.hexColor }}
            className="
              md:text-[33px]
              sm:text-[33px]
              text-[13px] 
              font-bold  
              transition-all
              ease-in-out
              duration-200
              text-sub3
              text-center
            ">
            {infoItem.title}
          </p>
          <p className="
          font-bold 
          text-sub2  
          md:text-[20px] 
          sm:text-[20px]
          text-[15px]  
          justify-center
          text-center
          ">
            {infoItem.loc}
          </p>
        </VStack>

        <Image
          src={infoItem.pic}     // path from /public
          alt={infoItem.picAlt}
          width={100}
          height={100}
          className="absolute end-10 rounded-full md:w-[60px] md:h-[60px] sm:w-[50px] sm:h-[50px] w-[40px] h-[40px] object-cover flex-shrink-0 "
        />
      </HStack>
      <VStack>
        <p className="
          text-sub2  
          md:text-[20px] 
          sm:text-[20px]
          text-[13px]
          items-start  
          justify-center
          ml-4">
          Activities
        </p>
        <div

          className="
          flex
          sm:flex-row
          sm:h-full
          h-100
          flex-col
          gap-4
            overflow-x-auto
            overflow-y-visible
            [&::-webkit-scrollbar]:h-[0px]
            hover:[&::-webkit-scrollbar]:h-[6px]
            [&::-webkit-scrollbar]:w-[0px]
            hover:[&::-webkit-scrollbar]:w-[6px]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/30
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
            justify-start
            snap-x snap-mandatory
            p-1
          ">
          {infoItem.actProjs.map((actProj: ActProj) => (
            <ActProjSection key={actProj.title} actProj={actProj} />
          ))}
        </div>
      </VStack>
      <HStack spacing={18}>
        {infoItem.gpa != null ?
          <VStack className="items-center">
            <p className="
              text-sub2  
              md:text-[20px] 
              sm:text-[20px]
              text-[13px]
              items-start  
              justify-center">
              GPA
            </p>
            <p className="
              text-sub3
              font-bold 
              md:text-[20px] 
              sm:text-[20px]
              text-[13px]
              items-start  
              justify-center
              px-10
              py-3
              rounded-[12px] 
              bg-sub1
              ">
              {infoItem.gpa}
            </p>
          </VStack>
          :
          <></>
        }
        <VStack className="items-center w-full">
          {infoItem.gpa != null
            ? (
              <p className="
                text-sub2  
                md:text-[20px] 
                sm:text-[20px]
                text-[13px]
                items-start  
                justify-center
              ">
                Degree
              </p>) : (
              <p className="
                text-sub2  
                md:text-[20px] 
                sm:text-[20px]
                text-[13px]
                items-start  
                justify-center
              ">
                Employer
              </p>)
          }
          <p className="
              text-sub3
              font-bold 
              md:text-[20px] 
              sm:text-[20px]
              text-[13px]
              text-center 
              justify-center
              py-3
              rounded-[12px] 
              bg-sub1
              w-full
              ">
            {infoItem.majorOrEmployer}
          </p>
        </VStack>
      </HStack>
    </VStack >
  );
}

function ActProjSection({ actProj }: { actProj: ActProj }) {
  return (
    <VStack
      className="
        bg-sub1 
        rounded-[12px] 
        p-4 
        justify-between 
          " spacing={4}>
      <VStack spacing={6}>
        <p className="
          text-sub3  
          md:text-[18px] 
          sm:text-[18px]
          text-[15px]
          font-bold
          items-start  
          justify-center
          w-full

          sm:whitespace-nowrap
          ">
          {actProj.title}
        </p>
        <Divider backgroundColor="bg-sub3" height={"h-[2px]"} />
        <p className="
          text-sub3  
          md:text-[13px] 
          sm:text-[13px]
          text-[11px]
          w-full
          ">
          {actProj.body}
        </p>
      </VStack>

      <HStack spacing={7} className="overflow-x-auto
            [&::-webkit-scrollbar]:h-[0px]
            hover:[&::-webkit-scrollbar]:h-[6px]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/30
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60">
        {actProj.skills.map((skill: string, index) => (
          <p key={index} className="
          
              text-sub3
              px-3
              py-1
              bg-sub2/20  
              md:text-[12px] 
              sm:text-[12px]
              text-[10px]
              items-start  
              justify-center
              relative bottom-0
              rounded-[10px]
              whitespace-nowrap
            ">
            {skill}
          </p>
        ))}
      </HStack>
    </VStack>
  );
}