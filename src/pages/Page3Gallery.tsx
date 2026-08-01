import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, MapPin, Calendar, Heart, Sparkles, ChevronLeft, ChevronRight, Play, Film, Video, Info, Eye } from "lucide-react";
import { PhotoItem } from "../types";
import { triggerHeartsConfetti } from "../utils/confetti";
import { CinematicVideoPlayer } from "../components/CinematicVideoPlayer";

interface Page3GalleryProps {
  photos: PhotoItem[];
  onNext: () => void;
  darkMode?: boolean;
}

interface FloatingHeartParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  drift: number;
  rotation: number;
  color: string;
}

export const Page3Gallery: React.FC<Page3GalleryProps> = ({ photos, onNext, darkMode = false }) => {
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartParticle[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "photos" | "videos">("all");
  const [videoErrorMap, setVideoErrorMap] = useState<Record<string, boolean>>({});
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    photos.forEach((p, idx) => {
      initial[p.id] = p.isVideo ? 28 + idx * 7 : 14 + idx * 5;
    });
    return initial;
  });
  const lastHoverTimeRef = useRef<number>(0);

  const incrementView = (id: string) => {
    setViewCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleOpenPhoto = (photo: PhotoItem) => {
    setActivePhoto(photo);
    incrementView(photo.id);
  };

  const filteredPhotos = photos.filter((p) => {
    if (galleryFilter === "photos") return !p.isVideo;
    if (galleryFilter === "videos") return p.isVideo;
    return true;
  });

  const activePhotoIndex = activePhoto ? filteredPhotos.findIndex((p) => p.id === activePhoto.id) : -1;

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nextPhoto: PhotoItem;
    if (activePhotoIndex > 0) {
      nextPhoto = filteredPhotos[activePhotoIndex - 1];
    } else {
      nextPhoto = filteredPhotos[filteredPhotos.length - 1];
    }
    setActivePhoto(nextPhoto);
    incrementView(nextPhoto.id);
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nextPhoto: PhotoItem;
    if (activePhotoIndex >= 0 && activePhotoIndex < filteredPhotos.length - 1) {
      nextPhoto = filteredPhotos[activePhotoIndex + 1];
    } else {
      nextPhoto = filteredPhotos[0];
    }
    setActivePhoto(nextPhoto);
    incrementView(nextPhoto.id);
  };

  // Keyboard Navigation inside Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === "Escape") {
        setActivePhoto(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPhoto();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, activePhotoIndex, filteredPhotos]);

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastHoverTimeRef.current < 180) return; // rate limit heart emissions
    lastHoverTimeRef.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    const colors = ["#f472b6", "#ec4899", "#f43f5e", "#fb7185", "#f0abfc", "#fda4af"];
    const count = Math.floor(Math.random() * 2) + 1; // 1 to 2 gentle floating hearts

    const newParticles: FloatingHeartParticle[] = Array.from({ length: count }).map((_, i) => ({
      id: `hover-${Date.now()}-${i}-${Math.random()}`,
      x: x + (Math.random() * 30 - 15),
      y: y + (Math.random() * 14 - 7),
      size: Math.floor(Math.random() * 12) + 14,
      drift: Math.random() * 50 - 25,
      rotation: Math.random() * 40 - 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setFloatingHearts((prev) => [...prev.slice(-30), ...newParticles]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1600);
  };

  const handleLoveClick = (e: React.MouseEvent<HTMLButtonElement>, photoId: string) => {
    e.stopPropagation();

    const isCurrentlyLiked = !!likedPhotos[photoId];
    setLikedPhotos((prev) => ({ ...prev, [photoId]: !isCurrentlyLiked }));
    setLikesCount((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + (isCurrentlyLiked ? -1 : 1),
    }));

    if (!isCurrentlyLiked) {
      triggerHeartsConfetti();
    }
  };

  const videoCount = photos.filter((p) => p.isVideo).length;
  const photoCount = photos.filter((p) => !p.isVideo).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative min-h-screen pb-24">
      {/* Hover Floating Heart Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 1,
                scale: 0.3,
                x: heart.x,
                y: heart.y,
                rotate: heart.rotation,
              }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0.5, 1.3, 0.9],
                x: heart.x + heart.drift,
                y: heart.y - 140 - Math.random() * 40,
                rotate: heart.rotation + (heart.drift > 0 ? 30 : -30),
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.6,
                ease: "easeOut",
              }}
              className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
              style={{ color: heart.color }}
            >
              <Heart className="fill-current filter drop-shadow-md" style={{ width: heart.size, height: heart.size }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 3 • Memory Gallery</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Captured Moments & Video Edits
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Hover over items for floating hearts, click any photo or video edit to play in full screen!
        </p>

        {/* Filter Tabs */}
        <div className="inline-flex items-center gap-1.5 p-1.5 mt-5 rounded-full bg-slate-200/60 dark:bg-slate-800/80 backdrop-blur-md border border-black/5 dark:border-white/5">
          <button
            onClick={() => setGalleryFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              galleryFilter === "all"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                : "text-slate-600 dark:text-slate-300 hover:text-pink-500"
            }`}
          >
            All ({photos.length})
          </button>
          <button
            onClick={() => setGalleryFilter("photos")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              galleryFilter === "photos"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                : "text-slate-600 dark:text-slate-300 hover:text-pink-500"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Photos ({photoCount})
          </button>
          <button
            onClick={() => setGalleryFilter("videos")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              galleryFilter === "videos"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                : "text-slate-600 dark:text-slate-300 hover:text-pink-500"
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Video Edits ({videoCount})
          </button>
        </div>
      </div>

      {/* Cinematic Video Edits Showcase */}
      {videoCount > 0 && galleryFilter !== "photos" && (
        <CinematicVideoPlayer
          videos={photos.filter((p) => p.isVideo)}
          viewCounts={viewCounts}
          onIncrementView={incrementView}
          darkMode={darkMode}
        />
      )}

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredPhotos.map((photo, idx) => {
          // Subtle random tilt for authentic polaroid look
          const tiltDegrees = idx % 3 === 0 ? -2 : idx % 3 === 1 ? 2 : 1;
          const isLiked = !!likedPhotos[photo.id];
          const count = likesCount[photo.id] || 0;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              onClick={() => handleOpenPhoto(photo)}
              onMouseEnter={handleCardHover}
              onMouseMove={handleCardHover}
              style={{ transform: `rotate(${tiltDegrees}deg)` }}
              className={`polaroid-card group cursor-pointer p-4 pb-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-2xl hover:z-20 border flex flex-col justify-between ${
                darkMode ? "bg-slate-900 border-slate-800 shadow-slate-950/50" : "bg-white border-slate-100 shadow-rose-200/40"
              }`}
            >
              <div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                  <img
                    src={
                      imageErrorMap[photo.id]
                        ? photo.fallbackUrl || photo.url
                        : photo.url
                    }
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setImageErrorMap((prev) => ({ ...prev, [photo.id]: true }));
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Video Badge Overlay */}
                  {photo.isVideo && (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg border border-white/20">
                      <Film className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                      <span>VIDEO EDIT</span>
                    </div>
                  )}

                  {/* View Count Badge Overlay */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/20">
                    <Eye className="w-3 h-3 text-pink-300" />
                    <span>{viewCounts[photo.id] || 0}</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white text-xs font-semibold">
                    {photo.isVideo ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </div>
                        <span className="bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">Play Video Edit 🎬</span>
                      </div>
                    ) : (
                      <span className="bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">Click to Expand 🔍</span>
                    )}
                  </div>
                </div>

                <div className="px-1 text-center">
                  <p className="font-serif italic text-sm font-medium line-clamp-2 text-slate-800 dark:text-slate-200">
                    "{photo.caption}"
                  </p>
                  {photo.shortCaption && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-sans leading-relaxed line-clamp-2">
                      {photo.shortCaption}
                    </p>
                  )}
                  {photo.date && (
                    <span className="text-[10px] text-pink-500 font-semibold mt-1.5 inline-block">
                      {photo.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Love Button Row */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={(e) => handleLoveClick(e, photo.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm active:scale-90 ${
                    isLiked
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30 scale-105"
                      : darkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-pink-500/20 hover:text-pink-400"
                      : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform ${
                      isLiked ? "fill-white scale-110 text-white" : "fill-pink-300 text-pink-500"
                    }`}
                  />
                  <span>Love</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isLiked ? "bg-white/20 text-white" : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300"}`}>
                      {count}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  <Eye className="w-3.5 h-3.5 text-pink-500/80" />
                  <span>{viewCounts[photo.id] || 0} views</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal Overlay */}
      <AnimatePresence>
        {activePhoto && (
          <div
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl transition-all"
          >
            {/* Top Bar with Counter & Close Button */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium tracking-wide flex items-center gap-2">
                {activePhoto.isVideo ? <Video className="w-3.5 h-3.5 text-pink-400" /> : <Camera className="w-3.5 h-3.5 text-pink-400" />}
                <span>
                  {activePhoto.isVideo ? "Video Edit" : "Photo"} {activePhotoIndex >= 0 ? activePhotoIndex + 1 : 1} of {filteredPhotos.length}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1 text-pink-300 font-medium">
                  <Eye className="w-3.5 h-3.5 text-pink-400" />
                  <span>{viewCounts[activePhoto.id] || 0} views</span>
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhoto(null);
                }}
                title="Close Lightbox (Esc)"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md active:scale-90 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Left Navigation Arrow */}
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={handlePrevPhoto}
                title="Previous Memory (Left Arrow)"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md border border-white/10 shadow-2xl active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Navigation Arrow */}
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={handleNextPhoto}
                title="Next Memory (Right Arrow)"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md border border-white/10 shadow-2xl active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Lightbox Main Container */}
            <motion.div
              key={activePhoto.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 p-5 sm:p-7 flex flex-col items-center my-auto z-20"
            >
              <div className="w-full flex-1 max-h-[58vh] rounded-2xl overflow-hidden mb-4 bg-slate-950 flex items-center justify-center relative group">
                {activePhoto.isVideo ? (
                  <video
                    key={activePhoto.id + (videoErrorMap[activePhoto.id] ? "-fallback" : "-local")}
                    controls
                    autoPlay
                    loop
                    playsInline
                    poster={activePhoto.url}
                    onError={() => {
                      setVideoErrorMap((prev) => ({ ...prev, [activePhoto.id]: true }));
                    }}
                    src={
                      videoErrorMap[activePhoto.id]
                        ? activePhoto.fallbackVideoUrl || activePhoto.url
                        : activePhoto.videoUrl || activePhoto.fallbackVideoUrl
                    }
                    className="w-full h-full object-contain max-h-[58vh] rounded-2xl"
                  />
                ) : (
                  <img
                    src={
                      imageErrorMap[activePhoto.id]
                        ? activePhoto.fallbackUrl || activePhoto.url
                        : activePhoto.url
                    }
                    alt={activePhoto.caption}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setImageErrorMap((prev) => ({ ...prev, [activePhoto.id]: true }));
                    }}
                    className="w-full h-full object-contain max-h-[58vh] rounded-2xl select-none"
                  />
                )}
              </div>

              {/* Local Source Info Notice */}
              {activePhoto.isVideo ? (
                <div className="w-full max-w-xl mb-3 px-3.5 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/50 flex items-center justify-between text-xs text-pink-700 dark:text-pink-300">
                  <div className="flex items-center gap-2 truncate">
                    <Info className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Fetching from: <code className="font-mono bg-pink-100 dark:bg-pink-900/60 px-1.5 py-0.5 rounded text-[11px]">{activePhoto.videoUrl}</code>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0 bg-pink-200 dark:bg-pink-900 px-2 py-0.5 rounded-full">
                    {videoErrorMap[activePhoto.id] ? "Preview Stream" : "Local Video"}
                  </span>
                </div>
              ) : activePhoto.url.startsWith("/photos/") ? (
                <div className="w-full max-w-xl mb-3 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
                  <div className="flex items-center gap-2 truncate">
                    <Info className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Fetching from: <code className="font-mono bg-purple-100 dark:bg-purple-900/60 px-1.5 py-0.5 rounded text-[11px]">{activePhoto.url}</code>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0 bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    {imageErrorMap[activePhoto.id] ? "Fallback Photo" : "Local JPEG"}
                  </span>
                </div>
              ) : null}

              <div className="text-center max-w-xl space-y-2.5">
                <h3 className="text-lg sm:text-2xl font-serif italic font-medium text-slate-900 dark:text-slate-100 leading-snug">
                  "{activePhoto.caption}"
                </h3>

                {activePhoto.shortCaption && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto italic font-sans">
                    {activePhoto.shortCaption}
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {activePhoto.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-500" /> {activePhoto.date}
                    </span>
                  )}
                  {activePhoto.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {activePhoto.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-semibold">
                    <Eye className="w-3.5 h-3.5 text-pink-500" /> {viewCounts[activePhoto.id] || 0} views
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleLoveClick(e, activePhoto.id)}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-md active:scale-95 ${
                      likedPhotos[activePhoto.id]
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30 scale-105"
                        : darkMode
                        ? "bg-slate-800 text-slate-200 hover:bg-pink-500/20"
                        : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedPhotos[activePhoto.id] ? "fill-white text-white" : "fill-pink-300 text-pink-500"
                      }`}
                    />
                    <span>{likedPhotos[activePhoto.id] ? "Loved ❤️" : "Send Love"}</span>
                    {(likesCount[activePhoto.id] || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold text-[11px]">
                        {likesCount[activePhoto.id]}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
        >
          Next: Our Playlist
        </button>
      </div>
    </div>
  );
};
