"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Plus from "../../../public/svg/plus.svg";

interface BlurOverlayProps {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  showXAndTap?: boolean;
}

export default function BlurOverlay({ show, onClose, children, showXAndTap = true }: BlurOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          onClick={() => {
            if (showXAndTap) {onClose()};
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="
          w-full
            fixed inset-0 z-50
            backdrop-blur-md bg-background/30
            flex items-center justify-center
          "
        >
          {/* Close Button */}
          {showXAndTap && <button
            type="button"
            onClick={() => {
              if (showXAndTap) {onClose()};
            }}
            className="
              absolute top-10 right-10
              rounded-full
              active:scale-95 
              transition-all
              ease-in-out
              duration-300
              cursor-pointer
            "
          >
            <Plus className="text-accent hover:brightness-75 md:h-8 sm:h-7 h-6 w-6 md:w-8 sm:w-7 rotate-45 transition-all
              ease-in-out
              duration-300" />
          </button>}

          {/* Overlay Content */}
          <motion.div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-60 w-full max-w-4xl p-4 overflow-y-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

