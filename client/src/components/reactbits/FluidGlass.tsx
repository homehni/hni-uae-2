"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FluidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function FluidGlass({ 
  children, 
  className = "", 
  intensity = 0.3 
}: FluidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      container.style.setProperty("--mouse-x", `${x}%`);
      container.style.setProperty("--mouse-y", `${y}%`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        background: `
          radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, ${intensity}) 0%,
            rgba(255, 255, 255, ${intensity * 0.5}) 25%,
            rgba(255, 255, 255, ${intensity * 0.2}) 50%,
            transparent 100%
          )
        `,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {children}
    </div>
  );
}


