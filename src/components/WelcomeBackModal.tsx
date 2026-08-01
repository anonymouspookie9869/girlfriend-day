import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ArrowRight } from "lucide-react";

interface WelcomeBackModalProps {
  isOpen: boolean;
  savedPage: number;
  pageTitle: string;
  onResume: () => void;
  onStartOver: () => void;
  darkMode?: boolean;
}

export const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({
  isOpen,
  savedPage,
  pageTitle,
  onResume,
  onStartOver,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border ${
            darkMode
              ? "bg-slate-900/90 border-slate-800 text-slate-100 shadow-pink-950/20"
              : "bg-white/90 border-white text-slate-800 shadow-rose-200/50"
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-500 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-pink-500" />
          </div>

          <h3 className="text-xl font-serif font-semibold mb-1">Welcome back ❤️</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            You previously left off on <span className="font-semibold text-pink-500">Page {savedPage}: {pageTitle}</span>.
          </p>

          <div className="space-y-2">
            <button
              onClick={onResume}
              className="w-full py-3 px-5 rounded-2xl font-medium text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Resume Where You Left Off <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartOver}
              className={`w-full py-2.5 px-5 rounded-2xl text-xs font-medium hover:underline transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Start From Beginning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
