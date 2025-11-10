

import { VStack, HStack, Text, Spacer } from "../Components/components";
import Circle from "../../../public/svg/circle.svg";
import Image from "next/image";
import { hexToRgba } from "@/app/lib/hextoRgba";
import { motion } from "framer-motion";

export default function InfoCollection({ infoItem, index }: { infoItem: InfoItem, index: number }) {
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: (index + 1) * 0.2 }}
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

  export function InfoCollectionBig({ infoItem }: { infoItem: InfoItem}) {

    return (
        <VStack>

        </VStack>
    );
  }