import React, { useEffect, useState } from "react";

export const CursorGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isBtn = !!target.closest("button, a, input, [role='button']");
        const isImg = !!target.closest("img, .polaroid-card");
        setIsHoveringButton(isBtn);
        setIsHoveringImage(isImg);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Soft Glowing Trail */}
      <div
        className="absolute rounded-full transition-all duration-150 ease-out blur-xl"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHoveringButton ? "120px" : isHoveringImage ? "90px" : "60px",
          height: isHoveringButton ? "120px" : isHoveringImage ? "90px" : "60px",
          transform: "translate(-50%, -50%)",
          background: isHoveringImage
            ? "radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(244,114,182,0.2) 70%, transparent 100%)"
            : "radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(192,132,252,0.15) 70%, transparent 100%)",
        }}
      />

      {/* Sparkle ring on image hover */}
      {isHoveringImage && (
        <div
          className="absolute rounded-full border border-pink-300/60 animate-ping"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: "40px",
            height: "40px",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};
