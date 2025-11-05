"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            backdrop-blur-md bg-black/30
            flex items-center justify-center
          "
          onClick={onClose}
        >
          <motion.div
            onClick={(e: any) => e.stopPropagation()} // Prevent click-through
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-60"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
