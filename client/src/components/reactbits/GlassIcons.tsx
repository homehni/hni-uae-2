"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassIconProps {
  icon: React.ReactNode;
  href?: string;
  label?: string;
  className?: string;
}

export function GlassIcon({ icon, href, label, className = "" }: GlassIconProps) {
  const content = (
    <motion.div
      className={`relative p-3 rounded-lg backdrop-blur-md bg-background/50 border border-border/50 hover:border-primary/50 transition-all ${className}`}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10 flex items-center justify-center">
        {icon}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-lg" />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {content}
      </a>
    );
  }

  return content;
}

interface GlassIconsProps {
  icons: Array<{ icon: React.ReactNode; href?: string; label?: string }>;
  className?: string;
}

export function GlassIcons({ icons, className = "" }: GlassIconsProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {icons.map((item, index) => (
        <GlassIcon
          key={index}
          icon={item.icon}
          href={item.href}
          label={item.label}
        />
      ))}
    </div>
  );
}


