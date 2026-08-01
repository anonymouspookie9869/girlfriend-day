import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ChevronLeft, ChevronRight, Shuffle, Search, Sparkles } from "lucide-react";
import { ReasonItem } from "../types";

interface Page5ReasonsProps {
  reasons: ReasonItem[];
  onNext: () => void;
  darkMode?: boolean;
}

export const Page5Reasons: React.FC<Page5ReasonsProps> = ({ reasons, onNext, darkMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const activeReason = reasons[currentIndex] || reasons[0];

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
  };

  const handlePrevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  const handleRandomCard = () => {
    const randomIdx = Math.floor(Math.random() * reasons.length);
    setCurrentIndex(randomIdx);
  };

  const filteredReasons = reasons.filter((r) =>
    r.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 5 • Appreciation Cards</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          100 Reasons I Appreciated You
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Swipe or browse through 100 genuine reasons of heartfelt appreciation.
        </p>
      </div>

      {/* Main Interactive Deck Card */}
      <div className="relative w-full max-w-lg mx-auto min-h-[280px] sm:min-h-[320px] mb-8 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeReason.id}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-full p-8 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl border text-center relative overflow-hidden flex flex-col items-center justify-between ${
              darkMode
                ? "bg-slate-900/80 border-slate-800 shadow-pink-950/30"
                : "bg-white/80 border-white/90 shadow-rose-200/60"
            }`}
          >
            {/* Top Badge Number */}
            <div className="flex items-center justify-between w-full mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-500 border border-pink-500/20">
                Reason #{activeReason.id} of {reasons.length}
              </span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>

            {/* Core Card Text */}
            <h3 className="text-xl sm:text-2xl font-serif font-medium leading-relaxed my-auto bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
              "{activeReason.text}"
            </h3>

            {/* Bottom Category Tag */}
            {activeReason.category && (
              <span className="mt-6 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Category: {activeReason.category}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Deck Controls */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={handlePrevCard}
          aria-label="Previous Reason"
          className="p-3 rounded-full border border-inherit hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleRandomCard}
          className="px-5 py-2.5 rounded-full border border-pink-200 dark:border-pink-800/60 bg-pink-50 dark:bg-pink-950/40 text-pink-500 font-medium text-xs flex items-center gap-2 hover:bg-pink-100 transition-all"
        >
          <Shuffle className="w-4 h-4" /> Random Reason
        </button>

        <button
          onClick={handleNextCard}
          aria-label="Next Reason"
          className="p-3 rounded-full border border-inherit hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Direct Jump or Quick Search Filter */}
      <div className="max-w-md mx-auto w-full mb-10">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reasons (e.g. smile, laugh, support)..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border outline-none ${
              darkMode
                ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500"
                : "bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400"
            }`}
          />
        </div>

        {searchQuery && (
          <div className="mt-3 max-h-40 overflow-y-auto space-y-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit">
            {filteredReasons.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">No matching reasons found.</p>
            ) : (
              filteredReasons.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    const idx = reasons.findIndex((x) => x.id === r.id);
                    if (idx !== -1) setCurrentIndex(idx);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-pink-500/10 truncate"
                >
                  <span className="font-semibold text-pink-500">#{r.id}</span>: {r.text}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
        >
          Next: Memory Book
        </button>
      </div>
    </div>
  );
};
