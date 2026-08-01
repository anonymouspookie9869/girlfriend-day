import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  Sparkles,
  Info,
  Eye
} from "lucide-react";
import { PhotoItem } from "../types";
import { triggerHeartsConfetti } from "../utils/confetti";

interface CinematicVideoPlayerProps {
  videos: PhotoItem[];
  viewCounts?: Record<string, number>;
  onIncrementView?: (id: string) => void;
  darkMode?: boolean;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  videos,
  viewCounts = {},
  onIncrementView,
  darkMode = false,
}) => {
  const [activeVideo, setActiveVideo] = useState<PhotoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [videoErrorMap, setVideoErrorMap] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = activeVideo ? videos.findIndex((v) => v.id === activeVideo.id) : -1;

  const handleSelectVideo = (video: PhotoItem) => {
    setActiveVideo(video);
    if (onIncrementView) {
      onIncrementView(video.id);
    }
  };

  // Auto play when active video changes
  useEffect(() => {
    if (activeVideo) {
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [activeVideo]);

  // Video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nextVid: PhotoItem;
    if (activeIndex >= 0 && activeIndex < videos.length - 1) {
      nextVid = videos[activeIndex + 1];
    } else {
      nextVid = videos[0];
    }
    setActiveVideo(nextVid);
    if (onIncrementView) {
      onIncrementView(nextVid.id);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nextVid: PhotoItem;
    if (activeIndex > 0) {
      nextVid = videos[activeIndex - 1];
    } else {
      nextVid = videos[videos.length - 1];
    }
    setActiveVideo(nextVid);
    if (onIncrementView) {
      onIncrementView(nextVid.id);
    }
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!likedMap[id]) {
      triggerHeartsConfetti();
    }
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return "00:00";
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeVideo) return;
      if (e.key === "Escape") {
        setActiveVideo(null);
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo, activeIndex, isPlaying, isMuted]);

  return (
    <div className="w-full my-10">
      {/* Header section for cinematic showcase */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Cinematic Memory Edits
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any edit to launch full-screen theater mode
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-semibold flex items-center gap-1.5 border border-pink-200 dark:border-pink-800/40">
          <span>4 Video Edits</span>
        </div>
      </div>

      {/* 4 Video Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {videos.map((video, idx) => {
          const isLiked = !!likedMap[video.id];

          return (
            <motion.div
              key={video.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => handleSelectVideo(video)}
              className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg flex flex-col justify-between ${
                darkMode
                  ? "bg-slate-900/90 border-slate-800 shadow-slate-950/60 hover:border-pink-500/50 hover:shadow-pink-500/10"
                  : "bg-white border-rose-100 shadow-rose-200/50 hover:border-pink-300 hover:shadow-pink-300/30"
              }`}
            >
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={video.url}
                  alt={video.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/90 transition-all" />

                {/* Video Tag */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider flex items-center gap-1 border border-white/20">
                  <Film className="w-3 h-3 text-pink-400" />
                  <span>EDIT #{idx + 1}</span>
                </div>

                {/* View Count Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/20">
                  <Eye className="w-3 h-3 text-pink-300" />
                  <span>{viewCounts[video.id] || 0}</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform duration-300 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-rose-500 ring-4 ring-white/20">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom title inside thumbnail */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <p className="text-xs font-semibold truncate drop-shadow-sm">{video.caption}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-pink-500" />
                    <span>{viewCounts[video.id] || 0} views</span>
                  </span>
                  <span>•</span>
                  <span>{video.date || "Cinematic Reel"}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleLike(e, video.id)}
                  className={`p-1.5 rounded-full transition-all ${
                    isLiked ? "text-rose-500 bg-rose-50 dark:bg-rose-950/60 scale-110" : "text-slate-400 hover:text-rose-500"
                  }`}
                  title="Send Love"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Cinematic Theater Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/92 backdrop-blur-2xl transition-all"
          >
            {/* Top Bar Navigation & Info */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-40 pointer-events-auto">
              <div className="px-4 py-2 rounded-full bg-white/10 dark:bg-black/60 backdrop-blur-xl border border-white/15 text-white text-xs font-semibold flex items-center gap-2.5 shadow-2xl">
                <Film className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>
                  Cinematic Edit {activeIndex >= 0 ? activeIndex + 1 : 1} of {videos.length}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1 text-pink-300">
                  <Eye className="w-3.5 h-3.5 text-pink-400" />
                  <span>{viewCounts[activeVideo.id] || 0} views</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline" />
                <span className="text-pink-300 hidden sm:inline truncate max-w-xs">{activeVideo.caption}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVideo(null);
                }}
                title="Exit Theater Mode (Esc)"
                className="p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all backdrop-blur-xl active:scale-90 border border-white/20 shadow-2xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Next / Prev Navigation Controls */}
            {videos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Previous Edit (Left Arrow)"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-xl border border-white/15 shadow-2xl active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  title="Next Edit (Right Arrow)"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-xl border border-white/15 shadow-2xl active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main Video Theater Stage */}
            <motion.div
              ref={containerRef}
              key={activeVideo.id}
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col items-center my-auto z-30 group"
            >
              {/* Video Display Container */}
              <div
                onClick={togglePlay}
                className="w-full flex-1 max-h-[65vh] bg-black flex items-center justify-center relative cursor-pointer overflow-hidden"
              >
                <video
                  ref={videoRef}
                  key={activeVideo.id + (videoErrorMap[activeVideo.id] ? "-fallback" : "-local")}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  poster={activeVideo.url}
                  onTimeUpdate={handleTimeUpdate}
                  onError={() => {
                    setVideoErrorMap((prev) => ({ ...prev, [activeVideo.id]: true }));
                  }}
                  src={
                    videoErrorMap[activeVideo.id]
                      ? activeVideo.fallbackVideoUrl || activeVideo.url
                      : activeVideo.videoUrl || activeVideo.fallbackVideoUrl
                  }
                  className="w-full h-full object-contain max-h-[65vh]"
                />

                {/* Big Center Play / Pause Flash Animation */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute w-20 h-20 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-2xl pointer-events-none backdrop-blur-md"
                    >
                      <Play className="w-9 h-9 fill-white ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom Cinematic Controls Bar */}
              <div className="w-full bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 p-4 sm:p-5 flex flex-col gap-3">
                {/* Scrubber Progress Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400"
                  />
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
                      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                      title={isMuted ? "Unmute (M)" : "Mute (M)"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-pink-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <div className="hidden sm:flex flex-col text-left pl-2">
                      <span className="text-sm font-serif italic text-white font-medium line-clamp-1">
                        "{activeVideo.caption}"
                      </span>
                      {activeVideo.shortCaption && (
                        <span className="text-xs text-slate-400 truncate max-w-sm">
                          {activeVideo.shortCaption}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleLike(e, activeVideo.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        likedMap[activeVideo.id]
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30 scale-105"
                          : "bg-slate-800 text-slate-200 hover:bg-pink-500/20 hover:text-pink-300"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedMap[activeVideo.id] ? "fill-white" : "fill-pink-400"}`} />
                      <span>{likedMap[activeVideo.id] ? "Loved ❤️" : "Send Love"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                      title="Fullscreen"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Local Video Path Banner */}
                <div className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2 truncate">
                    <Info className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">
                      Local Path: <code className="font-mono text-pink-300">{activeVideo.videoUrl}</code>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-pink-400 shrink-0">
                    {videoErrorMap[activeVideo.id] ? "Fallback Stream" : "Local File Ready"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
