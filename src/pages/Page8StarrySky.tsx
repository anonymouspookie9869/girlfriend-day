import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Sparkles, X, Heart } from "lucide-react";
import { StarWish } from "../types";
import { triggerStarsConfetti } from "../utils/confetti";

interface Page8StarrySkyProps {
  starWishes: StarWish[];
  openedStars: string[];
  onOpenStar: (starId: string) => void;
  onNext: () => void;
  darkMode?: boolean;
}

export const Page8StarrySky: React.FC<Page8StarrySkyProps> = ({
  starWishes,
  openedStars,
  onOpenStar,
  onNext,
  darkMode = false,
}) => {
  const [activeStar, setActiveStar] = useState<StarWish | null>(null);

  const handleStarClick = (star: StarWish) => {
    setActiveStar(star);
    if (!openedStars.includes(star.id)) {
      onOpenStar(star.id);
      triggerStarsConfetti();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 8 • Starlight</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          The Starry Sky
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Tap each glowing star to reveal a wish for your journey. ({openedStars.length}/{starWishes.length} Wishes Unlocked)
        </p>
      </div>

      {/* Night Sky Stage Container */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 mb-10">
        {/* Sky Ambient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-pink-950/40" />

        {/* Constellation Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <line x1="20%" y1="25%" x2="45%" y2="18%" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="45%" y1="18%" x2="75%" y2="30%" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="30%" y1="60%" x2="65%" y2="65%" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Interactive Stars */}
        {starWishes.map((star) => {
          const isUnlocked = openedStars.includes(star.id);

          return (
            <motion.button
              key={star.id}
              onClick={() => handleStarClick(star)}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2 + Math.random(), repeat: Infinity }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-3 group z-10"
            >
              <div
                className={`relative flex items-center justify-center p-2 rounded-full transition-all ${
                  isUnlocked ? "bg-amber-400/20 shadow-lg shadow-amber-400/50" : "hover:bg-white/10"
                }`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    isUnlocked
                      ? "text-amber-300 fill-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                      : "text-slate-300 hover:text-amber-200"
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Wish Reveal Modal */}
      <AnimatePresence>
        {activeStar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-800 bg-slate-900 text-white text-center relative"
            >
              <button
                onClick={() => setActiveStar(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-400/20">
                <Star className="w-8 h-8 fill-amber-300" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Starlight Wish
              </span>

              <h3 className="text-xl sm:text-2xl font-serif font-medium italic leading-relaxed my-4 text-amber-100">
                "{activeStar.wish}"
              </h3>

              <button
                onClick={() => setActiveStar(null)}
                className="w-full py-3 rounded-2xl font-medium text-xs text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition-all"
              >
                Close Wish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
        >
          Next: Hidden Messages
        </button>
      </div>
    </div>
  );
};
