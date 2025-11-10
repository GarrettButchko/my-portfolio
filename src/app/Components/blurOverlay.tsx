"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Plus from "../../../public/svg/plus.svg";

interface BlurOverlayProps {
  show: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function BlurOverlay({ show, onClose, children }: BlurOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="
            fixed inset-0 z-50
            backdrop-blur-md bg-background/30
            flex items-center justify-center
          "
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
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
            <Plus className="text-blue-500 hover:text-blue-700 md:h-8 sm:h-7 h-6 w-6 md:w-8 sm:w-7 rotate-45" />
          </button>

          {/* Overlay Content */}
          <motion.div
            onClick={(e: any) => e.stopPropagation()} // Prevent click-through
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-60 w-full max-w-lg p-4 max-h-[90vh] overflow-y-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

