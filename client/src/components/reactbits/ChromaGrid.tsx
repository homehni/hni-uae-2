"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ChromaGridProps {
  className?: string;
  cellSize?: number;
  colors?: string[];
}

export function ChromaGrid({ 
  className = "", 
  cellSize = 50,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]
}: ChromaGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const cells: Array<{
      x: number;
      y: number;
      color: string;
      opacity: number;
      targetOpacity: number;
    }> = [];

    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        cells.push({
          x: i * cellSize,
          y: j * cellSize,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.3,
          targetOpacity: Math.random() * 0.3,
        });
      }
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cells.forEach((cell) => {
        const distance = Math.sqrt(
          Math.pow(mouseX - (cell.x + cellSize / 2), 2) +
          Math.pow(mouseY - (cell.y + cellSize / 2), 2)
        );

        const maxDistance = 200;
        const influence = Math.max(0, 1 - distance / maxDistance);
        cell.targetOpacity = 0.1 + influence * 0.4;

        cell.opacity += (cell.targetOpacity - cell.opacity) * 0.1;

        ctx.fillStyle = cell.color;
        ctx.globalAlpha = cell.opacity;
        ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cellSize, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: "multiply" }}
    />
  );
}


