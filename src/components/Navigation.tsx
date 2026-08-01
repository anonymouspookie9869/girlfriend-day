import React, { useState } from "react";
import { Music, VolumeX, Moon, Sun, Edit3, Download, Share2, ChevronLeft, ChevronRight, Grid, Sparkles, X, CheckCircle2 } from "lucide-react";
import { ambientSynth } from "../utils/audioSynth";
import { exportMemoriesToPdf } from "../utils/pdfExport";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenEditDrawer: () => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  completedStats?: {
    openedFlowers: number;
    totalFlowers: number;
    openedStars: number;
    totalStars: number;
    foundHearts: number;
    totalHearts: number;
  };
}

export const PAGE_TITLES = [
  "Intro",
  "Quote of the Day",
  "Timeline of Us",
  "Memory Gallery",
  "Our Playlist",
  "100 Reasons",
  "Memory Book",
  "Flower Garden",
  "Starry Sky",
  "Hidden Messages",
  "Mini Quiz",
  "Music & Memories",
  "Heartfelt Letter",
  "Final Question",
];

export const PAGE_ICONS = [
  "✨", "💭", "⏳", "🖼️", "🎵", "💌", "📖", "🌸", "⭐", "🔍", "🎯", "🎼", "✉️", "❤️"
];

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  darkMode,
  onToggleDarkMode,
  onOpenEditDrawer,
  musicPlaying,
  onToggleMusic,
  completedStats,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Girlfriend Day ❤️",
          text: "A special memory book & appreciation gesture.",
          url: window.location.href,
        });
        return;
      } catch (e) {
        console.warn(e);
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdfDownload = async () => {
    setIsExporting(true);
    await exportMemoriesToPdf();
    setIsExporting(false);
  };

  return (
    <>
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-5xl">
        <div
          className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-full backdrop-blur-2xl border shadow-xl transition-all ${
            darkMode
              ? "bg-slate-900/85 border-slate-800/90 text-slate-100 shadow-slate-950/60"
              : "bg-white/80 border-white/90 text-slate-800 shadow-rose-200/40"
          }`}
        >
          {/* Left Controls: Page Title & Navigation Arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              aria-label="Previous Page"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 group text-left px-2 py-1 rounded-xl hover:bg-pink-500/10 transition-all"
              title="Click to view all chapters"
            >
              <span className="text-base sm:text-lg">{PAGE_ICONS[currentPage] || "✨"}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-pink-500 uppercase flex items-center gap-1">
                  {currentPage === 0 ? "Chapter 0" : `Chapter ${currentPage} of ${totalPages - 1}`}
                  <Grid className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="text-xs sm:text-sm font-semibold truncate max-w-[100px] sm:max-w-[160px] group-hover:text-pink-500 transition-colors">
                  {PAGE_TITLES[currentPage] || "Journey"}
                </span>
              </div>
            </button>

            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              aria-label="Next Page"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Center Progress Indicator Bar (Desktop) */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onPageChange(idx)}
                title={`Jump to ${PAGE_TITLES[idx]}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentPage
                    ? "w-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-sm shadow-pink-500/50"
                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-pink-400 hover:w-3"
                }`}
              />
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Chapters Grid Modal Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              title="Chapter Index & Progress"
              className="p-2 rounded-full hover:bg-pink-500/10 text-pink-500 transition-colors"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Music Toggle */}
            <button
              onClick={onToggleMusic}
              title={musicPlaying ? "Mute Ambient Soundtrack" : "Play Ambient Soundtrack"}
              className={`p-2 rounded-full transition-all active:scale-90 ${
                musicPlaying
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40 animate-pulse"
                  : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
              }`}
            >
              {musicPlaying ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors active:scale-90"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Edit Data JSON Drawer */}
            <button
              onClick={onOpenEditDrawer}
              title="Customize Memories Data"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors active:scale-90"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* PDF Export */}
            <button
              onClick={handlePdfDownload}
              disabled={isExporting}
              title="Export Memory Book to PDF"
              className="hidden sm:flex p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors active:scale-90 disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              title="Share Page Link"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors relative active:scale-90"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white whitespace-nowrap shadow-xl border border-slate-700 animate-bounce">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Chapter Navigation Modal / Grid Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl shadow-2xl border relative flex flex-col ${
              darkMode ? "bg-slate-900/95 border-slate-800 text-slate-100" : "bg-white/95 border-rose-100 text-slate-800"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <h3 className="text-xl font-serif font-bold">Chapter Directory</h3>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Jump directly to any memory page or activity in this experience.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {PAGE_TITLES.map((title, idx) => {
                const isActive = idx === currentPage;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onPageChange(idx);
                      setMenuOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 active:scale-95 ${
                      isActive
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white border-pink-400 shadow-lg shadow-pink-500/30 scale-[1.02]"
                        : darkMode
                        ? "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-pink-500/40 text-slate-200"
                        : "bg-pink-50/50 border-pink-100 hover:bg-pink-100/80 text-slate-800"
                    }`}
                  >
                    <span className="text-xl shrink-0">{PAGE_ICONS[idx]}</span>
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold block ${isActive ? "text-pink-100" : "text-pink-500"}`}>
                        Page {idx}
                      </span>
                      <span className="text-xs font-semibold truncate block">{title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close Directory
            </button>
          </div>
        </div>
      )}
    </>
  );
};

