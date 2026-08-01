import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

interface IntroPageProps {
  onNext: () => void;
  darkMode?: boolean;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onNext, darkMode = false }) => {
  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = "Happy Girlfriend Day ❤️";
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.slice(0, index + 1));
      index++;
      if (index >= fullTitle.length) {
        clearInterval(interval);
        setTimeout(() => setShowSubtext(true), 400);
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  const textLines = [
    "Some people become beautiful memories.",
    "Some memories never stop making us smile.",
    "Today isn't about the past.",
    "It's simply about appreciating someone who once meant the world to me.",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-2xl p-8 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl border ${
          darkMode
            ? "bg-slate-900/60 border-slate-800 shadow-pink-950/20"
            : "bg-white/60 border-white/80 shadow-rose-200/50"
        }`}
      >
        {/* Floating Heart Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30"
        >
          <Heart className="w-8 h-8 fill-white" />
        </motion.div>

        {/* Typing Title */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-8 min-h-[3rem] bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
          {typedTitle}
          <span className="animate-pulse text-pink-500">|</span>
        </h1>

        {/* Sequenced Text Lines */}
        {showSubtext && (
          <div className="space-y-4 mb-10 text-base sm:text-lg font-light leading-relaxed">
            {textLines.map((line, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.5 }}
                className={idx === 3 ? "font-medium text-pink-500 pt-2" : darkMode ? "text-slate-300" : "text-slate-700"}
              >
                {line}
              </motion.p>
            ))}
          </div>
        )}

        {/* Begin Button */}
        {showSubtext && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            onClick={onNext}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Begin Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
