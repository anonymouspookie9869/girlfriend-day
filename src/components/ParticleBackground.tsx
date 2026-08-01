import React, { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  darkMode?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ darkMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particles array
    const particlesCount = Math.min(Math.floor(width / 18), 70);
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      type: "heart" | "star" | "petal";
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colorsLight = ["#f472b6", "#ec4899", "#a855f7", "#c084fc", "#fbcfe8"];
    const colorsDark = ["#f472b6", "#fb7185", "#e879f9", "#38bdf8", "#fef08a"];

    for (let i = 0; i < particlesCount; i++) {
      const isHeart = i % 4 === 0;
      const isPetal = i % 3 === 0 && !isHeart;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHeart ? Math.random() * 8 + 6 : isPetal ? Math.random() * 6 + 4 : Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.8) * 0.5 - 0.1, // Floating upwards/sideways
        alpha: Math.random() * 0.7 + 0.3,
        type: isHeart ? "heart" : isPetal ? "petal" : "star",
        color: (darkMode ? colorsDark : colorsLight)[Math.floor(Math.random() * colorsLight.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Shooting stars
    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      alpha: number;
    }> = [];

    const addShootingStar = () => {
      if (Math.random() < 0.02 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 6 + 4,
          alpha: 1,
        });
      }
    };

    // Helper to draw heart path
    const drawHeart = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(cx, cy + topCurveHeight);
      ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
      ctx.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + size, cx, cy + size);
      ctx.bezierCurveTo(cx, cy + size, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight);
      ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render background particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y < -20) p.y = height + 20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === "heart") {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          drawHeart(0, 0, p.size);
          ctx.fill();
        } else if (p.type === "petal") {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Twinkling Star
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Render shooting stars
      addShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.speed;
        s.y += s.speed * 0.6;
        s.alpha -= 0.015;

        if (s.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y - s.length * 0.6);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y - s.length * 0.6);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: darkMode ? 0.95 : 0.85 }}
    />
  );
};
