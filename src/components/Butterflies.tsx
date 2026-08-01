import React, { useState } from "react";
import { motion } from "motion/react";

interface Butterfly {
  id: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const BUTTERFLIES: Butterfly[] = [
  { id: 1, size: 28, duration: 18, delay: 0, color: "#f472b6", startX: 5, startY: 80, endX: 90, endY: 10 },
  { id: 2, size: 22, duration: 22, delay: 4, color: "#c084fc", startX: 85, startY: 70, endX: 10, endY: 20 },
  { id: 3, size: 34, duration: 25, delay: 8, color: "#fb7185", startX: 15, startY: 30, endX: 80, endY: 85 },
  { id: 4, size: 20, duration: 20, delay: 2, color: "#e879f9", startX: 70, startY: 90, endX: 20, endY: 15 },
];

export const Butterflies: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {BUTTERFLIES.map((b) => {
        const isPaused = hoveredId === b.id;

        return (
          <motion.div
            key={b.id}
            initial={{ x: `${b.startX}vw`, y: `${b.startY}vh`, opacity: 0 }}
            animate={{
              x: isPaused ? undefined : [`${b.startX}vw`, `${b.endX}vw`, `${b.startX}vw`],
              y: isPaused ? undefined : [`${b.startY}vh`, `${b.endY}vh`, `${b.startY}vh`],
              rotate: [0, 15, -15, 10, 0],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: "easeInOut",
            }}
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute cursor-pointer pointer-events-auto filter drop-shadow-md transition-transform hover:scale-125"
            style={{ width: b.size, height: b.size }}
          >
            {/* SVG Butterfly with CSS Wing Flap */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full animate-pulse"
            >
              {/* Left Wing */}
              <motion.path
                d="M50 50 C20 10 0 30 10 60 C20 80 45 65 50 50 Z"
                fill={b.color}
                fillOpacity="0.85"
                animate={{ rotateY: [0, 60, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50px 50px" }}
              />
              {/* Right Wing */}
              <motion.path
                d="M50 50 C80 10 100 30 90 60 C80 80 55 65 50 50 Z"
                fill={b.color}
                fillOpacity="0.85"
                animate={{ rotateY: [0, -60, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50px 50px" }}
              />
              {/* Body */}
              <path d="M50 35 L50 65" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};
