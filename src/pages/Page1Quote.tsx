import React from "react";
import { motion } from "motion/react";
import { Quote, ArrowRight, Sparkles } from "lucide-react";

interface Page1QuoteProps {
  onNext: () => void;
  darkMode?: boolean;
}

export const Page1Quote: React.FC<Page1QuoteProps> = ({ onNext, darkMode = false }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-2xl p-8 sm:p-14 rounded-3xl backdrop-blur-2xl shadow-2xl border relative overflow-hidden ${
          darkMode
            ? "bg-slate-900/60 border-slate-800 shadow-pink-950/20"
            : "bg-white/60 border-white/80 shadow-rose-200/50"
        }`}
      >
        <Quote className="w-12 h-12 mx-auto mb-6 text-pink-400 opacity-80" />

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-2xl sm:text-4xl font-serif italic font-medium leading-relaxed mb-8 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent"
        >
          "Every story leaves something beautiful behind."
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-sm sm:text-base font-light max-w-md mx-auto mb-10 ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Moments pass, chapters close, but the genuine light we shared stays forever in memory.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onNext}
          className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 hover:scale-105 transition-all cursor-pointer overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
        </motion.button>
      </motion.div>
    </div>
  );
};
