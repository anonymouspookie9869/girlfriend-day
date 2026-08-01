import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower, Sparkles, Heart, X, Check, Eye } from "lucide-react";
import { FlowerItem } from "../types";
import { triggerFlowersConfetti } from "../utils/confetti";
import { BloomingFlowers } from "../components/BloomingFlowers";

interface Page7FlowerGardenProps {
  flowers: FlowerItem[];
  openedFlowers: string[];
  onOpenFlower: (flowerId: string) => void;
  onNext: () => void;
  darkMode?: boolean;
}

export const Page7FlowerGarden: React.FC<Page7FlowerGardenProps> = ({
  flowers,
  openedFlowers,
  onOpenFlower,
  onNext,
  darkMode = false,
}) => {
  const [selectedFlower, setSelectedFlower] = useState<FlowerItem | null>(null);
  const [showFullBloom, setShowFullBloom] = useState(false);

  const handleFlowerClick = (flower: FlowerItem) => {
    setSelectedFlower(flower);
    if (!openedFlowers.includes(flower.id)) {
      onOpenFlower(flower.id);
      triggerFlowersConfetti();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 7 • The Garden</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          The Flower Garden 🌸
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Tap each flower to unlock a small message of appreciation. ({openedFlowers.length}/{flowers.length} Opened)
        </p>
      </div>

      {/* Interactive Blooming Animation Canvas Box */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-500">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Night Garden Bloom</span>
          </div>
          <button
            onClick={() => setShowFullBloom(!showFullBloom)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 hover:bg-pink-200 transition-all flex items-center gap-1.5 border border-pink-200 dark:border-pink-800/50 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showFullBloom ? "Collapse Bloom" : "Expand Fullscreen Garden"}</span>
          </button>
        </div>

        <motion.div
          layout
          className={`overflow-hidden rounded-3xl border border-pink-500/20 shadow-2xl transition-all ${
            showFullBloom ? "h-[500px]" : "h-[280px]"
          }`}
        >
          <BloomingFlowers className="w-full h-full" />
        </motion.div>
      </div>

      {/* Garden Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {flowers.map((flower) => {
          const isOpen = openedFlowers.includes(flower.id);

          return (
            <motion.div
              key={flower.id}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlowerClick(flower)}
              className={`cursor-pointer p-6 rounded-3xl backdrop-blur-xl border text-center flex flex-col items-center justify-between transition-all shadow-xl relative ${
                isOpen
                  ? "border-pink-400 bg-gradient-to-b from-pink-500/10 to-rose-500/10 shadow-pink-500/20"
                  : darkMode
                  ? "bg-slate-900/60 border-slate-800"
                  : "bg-white/60 border-white/80"
              }`}
            >
              {/* Badge Checkmark */}
              {isOpen && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Vector Flower Graphic */}
              <motion.div
                animate={isOpen ? { rotate: [0, 10, -10, 0] } : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner"
                style={{ backgroundColor: `${flower.color}20` }}
              >
                <Flower className="w-10 h-10" style={{ color: flower.color }} />
              </motion.div>

              <h3 className="font-serif font-semibold text-sm mb-0.5">{flower.name}</h3>
              <span className="text-[10px] text-slate-400 italic">{flower.symbolism}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Flower Message Modal */}
      <AnimatePresence>
        {selectedFlower && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border text-center relative ${
                darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-white text-slate-800"
              }`}
            >
              <button
                onClick={() => setSelectedFlower(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${selectedFlower.color}25` }}
              >
                <Flower className="w-12 h-12" style={{ color: selectedFlower.color }} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                {selectedFlower.symbolism}
              </span>
              <h3 className="text-2xl font-serif font-bold mt-1 mb-4">{selectedFlower.name}</h3>

              <p className="text-sm sm:text-base italic font-serif leading-relaxed text-slate-600 dark:text-slate-300 mb-6">
                "{selectedFlower.message}"
              </p>

              <button
                onClick={() => setSelectedFlower(null)}
                className="w-full py-3 rounded-2xl font-medium text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md"
              >
                Keep Flowers Blooming
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
          Next: Starry Sky
        </button>
      </div>
    </div>
  );
};
