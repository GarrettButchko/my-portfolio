import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

/* ------------------------------------------------------
 * Spacer (Fixed Tailwind Issue)
 * ------------------------------------------------------ */
export function Spacer({
  minH = 0,
  className = "",
}: {
  minH?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex-grow ${className}`}
      style={{ minHeight: minH }} // <-- FIX: inline style so Tailwind doesn't fail
    />
  );
}

/* ------------------------------------------------------
 * HStack
 * ------------------------------------------------------ */
export function HStack({
  children,
  spacing = 0,
  className = "",
  style,
  ...motionProps
}: { children?: React.ReactNode; spacing?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`flex flex-row ${className}`}
      style={{ gap: spacing, ...style }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------
 * VStack
 * ------------------------------------------------------ */
export function VStack({
  children,
  spacing = 0,
  className = "",
  style,
  ...motionProps
}: { children?: React.ReactNode; spacing?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`flex flex-col ${className}`}
      style={{ gap: spacing, ...style }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------
 * ZStack
 * ------------------------------------------------------ */
export function ZStack({
  children,
  className = "",
  ...motionProps
}: { children?: React.ReactNode; className?: string } & HTMLMotionProps<"div">) {
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

/* ------------------------------------------------------
 * Divider
 * ------------------------------------------------------ */
export function Divider({
  className = "",
  backgroundColor = "bg-foreground",
  height = "h-2",
}: {
  className?: string;
  backgroundColor?: string;
  height?: string;
}) {
  return <div className={`flex w-full ${backgroundColor} ${height} ${className}`} />;
}

/* ------------------------------------------------------
 * Text
 * ------------------------------------------------------ */
export function Text({
  children,
  variant = "body",
  className = "",
}: {
  children?: React.ReactNode;
  variant?: "title" | "subtitle" | "body" | "caption";
  className?: string;
}) {
  const variants = {
    title: "text-2xl font-bold",
    subtitle: "text-lg font-semibold",
    body: "text-base",
    caption: "text-sm",
  } as const;

  return (
    <p className={`${variants[variant]} ${className}`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------
 * Section
 * ------------------------------------------------------ */
export function Section({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <section className={`w-full px-6 ${className}`}>{children}</section>;
}
