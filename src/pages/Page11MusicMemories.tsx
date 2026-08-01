import React from "react";
import { motion } from "motion/react";
import { Music, Heart, Sparkles } from "lucide-react";
import { PhotoItem } from "../types";
import { getAssetUrl } from "../utils/assets";

interface Page11MusicMemoriesProps {
  photos: PhotoItem[];
  onNext: () => void;
  darkMode?: boolean;
}

export const Page11MusicMemories: React.FC<Page11MusicMemoriesProps> = ({
  photos,
  onNext,
  darkMode = false,
}) => {
  const lyricsList = [
    "Look at the stars, look how they shine for you...",
    "And all the things you do...",
    "Yeah, they were all yellow...",
    "Cause you're a sky full of stars...",
    "I'm gonna give you my heart...",
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 11 • Symphony</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Music & Weightless Memories
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Where lyrics meet the quiet elegance of shared moments.
        </p>
      </div>

      {/* Weightless Floating Photo Stage */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-2xl bg-gradient-to-b from-purple-950/20 via-pink-950/20 to-slate-950/40 mb-10 p-6 flex flex-col justify-between">
        {/* Animated Synced Lyrics Marquee */}
        <div className="relative z-10 max-w-lg mx-auto text-center my-auto bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
          <Music className="w-6 h-6 text-pink-400 mx-auto mb-2 animate-bounce" />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-lg sm:text-2xl font-serif italic text-pink-200"
          >
            "{lyricsList[0]}"
          </motion.div>
        </div>

        {/* Floating Weightless Photos */}
        {photos.slice(0, 4).map((photo, i) => {
          const positions = [
            { top: "10%", left: "8%" },
            { top: "15%", right: "8%" },
            { bottom: "12%", left: "12%" },
            { bottom: "10%", right: "12%" },
          ];

          return (
            <motion.div
              key={photo.id}
              style={positions[i]}
              animate={{
                y: [0, -12, 0],
                rotate: [i % 2 === 0 ? -4 : 4, i % 2 === 0 ? 4 : -4, i % 2 === 0 ? -4 : 4],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 sm:w-32 aspect-square rounded-2xl p-1.5 bg-white/80 dark:bg-slate-900/80 shadow-xl border border-white/40 overflow-hidden"
            >
              <img
                src={getAssetUrl(photo.url)}
                alt={photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
        >
          Next: The Letter
        </button>
      </div>
    </div>
  );
};
