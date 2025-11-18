import { useRef } from "react";
import { motion } from "framer-motion";

interface AuroraProps {
  className?: string;
  intensity?: number;
  colors?: string[];
  speed?: number;
  blend?: number;
}

export function Aurora({ 
  className = "", 
  intensity = 1,
  colors = ["#ffffff", "#00ff1e", "#0276f2"], // White, bright green, blue
  speed = 1,
  blend = 1
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate animation duration based on speed (inverse relationship)
  // Speed 1 = slower (longer duration), higher speed = faster (shorter duration)
  const baseDuration = 20;
  const animationDuration = baseDuration / speed;

  // Blend mode opacity calculation
  const blendOpacity = blend;

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Base gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              ${colors[0]} 0%,
              ${colors[1]} 33%,
              ${colors[2]} 66%,
              ${colors[0]} 100%
            )
          `,
          opacity: intensity * 0.8,
        }}
      />
      
      {/* Animated gradient orbs - Layer 1 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${hexToRgba(colors[0], blendOpacity)} 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${hexToRgba(colors[2], blendOpacity)} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 20%, ${hexToRgba(colors[1], blendOpacity)} 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${hexToRgba(colors[0], blendOpacity)} 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          mixBlendMode: "screen",
          opacity: blendOpacity,
        }}
      />
      
      {/* Animated gradient orbs - Layer 2 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 80% 50%, ${hexToRgba(colors[2], blendOpacity * 0.8)} 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${hexToRgba(colors[1], blendOpacity * 0.8)} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 80%, ${hexToRgba(colors[0], blendOpacity * 0.8)} 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${hexToRgba(colors[2], blendOpacity * 0.8)} 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: animationDuration * 1.25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          mixBlendMode: "screen",
          opacity: blendOpacity * 0.8,
        }}
      />

      {/* Additional animated layers for depth */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 30% 40%, ${hexToRgba(colors[0], blendOpacity * 0.5)} 0%, transparent 60%)`,
            `radial-gradient(ellipse at 70% 60%, ${hexToRgba(colors[2], blendOpacity * 0.5)} 0%, transparent 60%)`,
            `radial-gradient(ellipse at 30% 40%, ${hexToRgba(colors[0], blendOpacity * 0.5)} 0%, transparent 60%)`,
          ],
        }}
        transition={{
          duration: animationDuration * 0.75,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          mixBlendMode: "overlay",
          opacity: blendOpacity * 0.5,
        }}
      />
    </div>
  );
}

