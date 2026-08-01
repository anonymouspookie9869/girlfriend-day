import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronLeft, ChevronRight, Bookmark, Sparkles } from "lucide-react";
import { BookPage } from "../types";
import { getAssetUrl } from "../utils/assets";

interface Page6MemoryBookProps {
  bookPages: BookPage[];
  onNext: () => void;
  darkMode?: boolean;
}

export const Page6MemoryBook: React.FC<Page6MemoryBookProps> = ({ bookPages, onNext, darkMode = false }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);

  const currentPage = bookPages[activePageIndex] || bookPages[0];

  const handleNextBookPage = () => {
    setActivePageIndex((prev) => Math.min(bookPages.length - 1, prev + 1));
  };

  const handlePrevBookPage = () => {
    setActivePageIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 6 • Storybook</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          The Memory Book
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Flip through the pages of our shared story.
        </p>
      </div>

      {/* 3D Realistic Book Perspective Container */}
      <div className="perspective-1000 w-full max-w-2xl mx-auto mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.id}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.645, 0.045, 0.355, 1.0] }}
            style={{ transformStyle: "preserve-3d" }}
            className={`w-full min-h-[380px] sm:min-h-[420px] rounded-3xl shadow-2xl border p-8 sm:p-12 relative flex flex-col justify-between overflow-hidden ${
              darkMode
                ? "bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/60"
                : "bg-[#fdfbf7] border-amber-200/60 text-slate-800 shadow-amber-900/10"
            }`}
          >
            {/* Book Spine Center Marker */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />

            {/* Header / Bookmark */}
            <div className="flex items-center justify-between w-full mb-6 border-b border-inherit pb-3">
              <span className="text-xs font-serif font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" /> {currentPage.date || `Page ${currentPage.id}`}
              </span>
              <span className="text-xs text-slate-400">
                {activePageIndex + 1} / {bookPages.length}
              </span>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center">
              {currentPage.imageUrl && (
                <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-slate-100">
                  <img
                    src={getAssetUrl(currentPage.imageUrl)}
                    alt={currentPage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={currentPage.imageUrl ? "md:col-span-7" : "md:col-span-12"}>
                <h3 className="text-2xl font-serif font-bold mb-3 text-pink-600 dark:text-pink-400">
                  {currentPage.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed font-serif italic text-slate-700 dark:text-slate-300">
                  "{currentPage.content}"
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-3 border-t border-inherit text-center text-xs text-slate-400 italic">
              Tap next page to continue reading...
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Book Pagination */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <button
          onClick={handlePrevBookPage}
          disabled={activePageIndex === 0}
          className="px-5 py-2.5 rounded-full border border-inherit disabled:opacity-30 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/10 font-medium text-xs flex items-center gap-1 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Page
        </button>

        <span className="text-xs font-medium text-slate-500">
          Page {activePageIndex + 1} of {bookPages.length}
        </span>

        <button
          onClick={handleNextBookPage}
          disabled={activePageIndex === bookPages.length - 1}
          className="px-5 py-2.5 rounded-full border border-inherit disabled:opacity-30 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/10 font-medium text-xs flex items-center gap-1 transition-all"
        >
          Next Page <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
        >
          Next: Flower Garden
        </button>
      </div>
    </div>
  );
};
