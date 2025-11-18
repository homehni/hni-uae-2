"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface FlowingMenuProps {
  items: MenuItem[];
  className?: string;
}

export function FlowingMenu({ items, className = "" }: FlowingMenuProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (menuRef.current) {
      const activeElement = menuRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
        });
      }
    }
  }, [activeIndex]);

  const handleMouseEnter = (index: number, element: HTMLElement) => {
    setHoveredIndex(index);
    setIndicatorStyle({
      left: element.offsetLeft,
      width: element.offsetWidth,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    if (menuRef.current) {
      const activeElement = menuRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
        });
      }
    }
  };

  return (
    <nav
      ref={menuRef}
      className={`relative flex items-center gap-1 ${className}`}
    >
      {items.map((item, index) => (
        <Link key={index} href={item.href}>
          <motion.div
            className="relative px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter(index, e.currentTarget)}
            onMouseLeave={handleMouseLeave}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
          </motion.div>
        </Link>
      ))}
      
      <motion.div
        className="absolute bottom-0 h-0.5 bg-primary rounded-full"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </nav>
  );
}

