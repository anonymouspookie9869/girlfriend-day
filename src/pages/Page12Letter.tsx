import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Heart, Sparkles, ArrowRight } from "lucide-react";

interface Page12LetterProps {
  letterText: {
    greeting: string;
    body1: string;
    body2: string;
    body3: string;
    closing: string;
  };
  onNext: () => void;
  darkMode?: boolean;
}

export const Page12Letter: React.FC<Page12LetterProps> = ({
  letterText,
  onNext,
  darkMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto flex flex-col justify-center items-center">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 12 • Heartfelt Note</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          A Letter for You
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {isOpen ? "A sincere expression of gratitude." : "Click the wax seal to unseal the envelope."}
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative w-full max-w-lg min-h-[420px] flex items-center justify-center mb-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed Envelope with Wax Seal */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              onClick={() => setIsOpen(true)}
              className="cursor-pointer w-full p-10 rounded-3xl backdrop-blur-2xl shadow-2xl border bg-gradient-to-br from-pink-100/90 via-rose-50/90 to-purple-100/90 dark:from-slate-900/90 dark:to-pink-950/90 border-white/80 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-6 relative group overflow-hidden"
            >
              {/* Envelope Flap Lines */}
              <div className="absolute top-0 left-0 right-0 h-28 border-b border-pink-300/40 dark:border-pink-800/40 pointer-events-none" />

              <Mail className="w-12 h-12 text-pink-500 opacity-80" />

              <div className="space-y-1">
                <p className="font-serif italic text-lg font-medium text-slate-800 dark:text-slate-200">
                  "For someone special"
                </p>
                <span className="text-xs text-pink-500 font-semibold uppercase tracking-wider">
                  Tap Wax Seal to Open
                </span>
              </div>

              {/* Red Wax Seal */}
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 border-2 border-white/50 relative z-10"
              >
                <Heart className="w-8 h-8 fill-white" />
              </motion.div>
            </motion.div>
          ) : (
            /* Unfolded Letter Slide Out */
            <motion.div
              key="open-letter"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`w-full p-8 sm:p-12 rounded-3xl shadow-2xl border relative flex flex-col justify-between ${
                darkMode
                  ? "bg-slate-900/95 border-slate-800 text-slate-100 shadow-slate-950/60"
                  : "bg-[#fdfbf7] border-rose-200/60 text-slate-800 shadow-rose-200/40"
              }`}
            >
              {/* Letter Header */}
              <div className="mb-6 border-b border-inherit pb-4 flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-pink-600 dark:text-pink-400">
                  {letterText.greeting}
                </h3>
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>

              {/* Letter Body */}
              <div className="space-y-4 text-base sm:text-lg font-serif italic leading-relaxed text-slate-700 dark:text-slate-300">
                <p>{letterText.body1}</p>
                <p>{letterText.body2}</p>
                <p>{letterText.body3}</p>
                <p className="font-semibold text-pink-600 dark:text-pink-400 pt-2">
                  {letterText.closing}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-inherit text-xs text-slate-400 text-right font-serif">
                With sincere goodwill and warm memories ✨
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <button
            onClick={onNext}
            className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
          >
            Final Question <ArrowRight className="inline w-4 h-4 ml-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
