import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Search, X, Check, Sparkles } from "lucide-react";
import { HiddenMessage } from "../types";
import { triggerHeartsConfetti } from "../utils/confetti";

interface Page9HiddenMessagesProps {
  hiddenMessages: HiddenMessage[];
  foundHearts: string[];
  onFindHeart: (heartId: string) => void;
  onNext: () => void;
  darkMode?: boolean;
}

export const Page9HiddenMessages: React.FC<Page9HiddenMessagesProps> = ({
  hiddenMessages,
  foundHearts,
  onFindHeart,
  onNext,
  darkMode = false,
}) => {
  const [activeMessage, setActiveMessage] = useState<HiddenMessage | null>(null);

  const handleHeartClick = (hm: HiddenMessage) => {
    setActiveMessage(hm);
    if (!foundHearts.includes(hm.id)) {
      onFindHeart(hm.id);
      triggerHeartsConfetti();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 9 • Discovery</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Hidden Hearts & Messages
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          There are secret glowing hearts hidden across this canvas. Find them to reveal secret notes! ({foundHearts.length}/{hiddenMessages.length} Discovered)
        </p>
      </div>

      {/* Secret Canvas Stage */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10 mb-10">
        {/* Floating background clues */}
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none opacity-40">
          <p className="font-serif italic text-sm sm:text-base">
            "Some feelings don't need loud words... they rest quietly between the lines."
          </p>
        </div>

        {/* Hidden Hearts */}
        {hiddenMessages.map((hm) => {
          const isFound = foundHearts.includes(hm.id);

          return (
            <motion.button
              key={hm.id}
              onClick={() => handleHeartClick(hm)}
              style={{ left: `${hm.x}%`, top: `${hm.y}%` }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, -6, 0],
                opacity: isFound ? 1 : [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-4 group z-10"
            >
              <div
                className={`p-3 rounded-full transition-all ${
                  isFound
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/50"
                    : "bg-white/40 dark:bg-black/40 text-pink-400 hover:text-rose-500"
                }`}
              >
                <Heart className={`w-6 h-6 ${isFound ? "fill-white" : "fill-pink-300"}`} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Message Unlocked Modal */}
      <AnimatePresence>
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border text-center relative ${
                darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-white text-slate-800"
              }`}
            >
              <button
                onClick={() => setActiveMessage(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-8 h-8 fill-white" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                Hidden Note Discovered
              </span>

              <h3 className="text-xl sm:text-2xl font-serif font-medium italic leading-relaxed my-4 text-pink-600 dark:text-pink-400">
                "{activeMessage.message}"
              </h3>

              <button
                onClick={() => setActiveMessage(null)}
                className="w-full py-3 rounded-2xl font-medium text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md"
              >
                Keep Exploring
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
          Next: Mini Quiz
        </button>
      </div>
    </div>
  );
};
