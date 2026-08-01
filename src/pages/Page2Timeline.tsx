import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Smile, Heart, Sun, ChevronRight, X, Calendar } from "lucide-react";
import { TimelineItem } from "../types";

interface Page2TimelineProps {
  timeline: TimelineItem[];
  onNext: () => void;
  darkMode?: boolean;
}

export const Page2Timeline: React.FC<Page2TimelineProps> = ({ timeline, onNext, darkMode = false }) => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  const getIcon = (name?: string) => {
    switch (name) {
      case "MessageCircle":
        return <MessageCircle className="w-5 h-5 text-pink-500" />;
      case "Smile":
        return <Smile className="w-5 h-5 text-amber-500" />;
      case "Heart":
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case "Sun":
        return <Sun className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Interactive Timeline</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Moments Etched in Time
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Click on any memory card to expand the story behind it.
        </p>
      </div>

      {/* Timeline Grid / Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {timeline.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            onClick={() => setSelectedItem(item)}
            className={`group cursor-pointer p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              darkMode
                ? "bg-slate-900/60 border-slate-800 hover:border-pink-500/50 shadow-slate-950/30"
                : "bg-white/60 border-white/80 hover:border-pink-300 shadow-rose-100/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center">
                {getIcon(item.iconName)}
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200/50 dark:border-pink-800/50">
                {item.date}
              </span>
            </div>

            <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-pink-500 transition-colors">
              {item.title}
            </h3>
            <p className={`text-xs line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {item.description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-pink-500">
              Read Memory <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl border relative ${
                darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-white text-slate-800"
              }`}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-pink-100 dark:bg-pink-950/60">
                  {getIcon(selectedItem.iconName)}
                </div>
                <div>
                  <span className="text-xs text-pink-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {selectedItem.date}
                  </span>
                  <h3 className="text-2xl font-serif font-bold">{selectedItem.title}</h3>
                </div>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-6">
                {selectedItem.description}
              </p>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 rounded-xl font-medium text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md"
              >
                Close Memory
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
          Next: Memory Gallery
        </button>
      </div>
    </div>
  );
};
