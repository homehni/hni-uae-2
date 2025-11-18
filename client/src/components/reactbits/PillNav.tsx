"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PillNavItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface PillNavProps {
  items: PillNavItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function PillNav({ 
  items, 
  defaultValue, 
  onChange,
  className = "" 
}: PillNavProps) {
  const [activeValue, setActiveValue] = useState(defaultValue || items[0]?.value);

  const handleClick = (value: string) => {
    setActiveValue(value);
    onChange?.(value);
  };

  const activeIndex = items.findIndex(item => item.value === activeValue);

  return (
    <div className={`relative inline-flex items-center gap-1 p-1 rounded-full bg-muted border border-border ${className}`}>
      {items.map((item, index) => {
        const isActive = item.value === activeValue;
        return (
          <motion.button
            key={item.value}
            onClick={() => handleClick(item.value)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10 ${
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
          </motion.button>
        );
      })}
      
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-primary"
        layoutId="pill-nav-indicator"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          left: `${(activeIndex * 100) / items.length}%`,
          width: `${100 / items.length}%`,
        }}
      />
    </div>
  );
}


