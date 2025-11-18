"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardSwapProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function CardSwap({ front, back, className = "" }: CardSwapProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative perspective-1000 ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {front}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {back}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


