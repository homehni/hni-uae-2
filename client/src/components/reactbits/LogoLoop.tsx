"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoLoopProps {
  text: string;
  className?: string;
  duration?: number;
}

export function LogoLoop({ text, className = "", duration = 2 }: LogoLoopProps) {
  const letters = text.split("");

  return (
    <div className={`flex items-center ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}


