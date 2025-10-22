import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export function Spacer({ minH = 0}: { minH?: number; color?: string }) {
  const minHClass = `min-h-[${minH}px]`;
  return (
    <div className={`flex-grow ${minHClass}`}></div>
  );
}

export function HStack({ children, spacing = 0, className = "", ...motionProps }: { children?: React.ReactNode; spacing?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`flex flex-row items-center ${className}`}
      style={{ gap: `${spacing}px` }}
      {...motionProps} // allows initial, animate, exit, transition
    >
      {children}
    </motion.div>
  );
}




export function VStack({ children, spacing = 0, className = "", ...motionProps }: { children?: React.ReactNode; spacing?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      style={{ gap: `${spacing}px` }}
      {...motionProps} // pass initial, animate, exit, transition
    >
      {children}
    </motion.div>
  );
}


export function ZStack({ children, className = "", ...motionProps }: { children?: React.ReactNode; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div className={`relative ${className}`} {...motionProps}>
      {React.Children.map(children, (child, index) => (
        <div className={index === 0 ? "relative" : "absolute inset-0"}>
          {child}
        </div>
      ))}
    </motion.div>
  );
}




export function Divider({ className = "", borderColor = "border-foreground", height = 1 }) {
  return <hr className={`border-t ${borderColor} w-full h-${height} ${className}`} />;
}


export function Text({ children, variant = "body", className = "" }: { children?: React.ReactNode; variant?: "title" | "subtitle" | "body" | "caption"; className?: string, }) {
  const variants: Record<"title" | "subtitle" | "body" | "caption", string> = {
    title: "text-2xl font-bold",
    subtitle: "text-lg font-semibold",
    body: "text-base",
    caption: "text-sm",
  };


  return <p className={`${variants[variant]} ${className} `}>{children}</p>;
}


export function Section({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <section className={`w-full max-w-3xl px-6 ${className}`}>
      {children}
    </section>
  );
}
