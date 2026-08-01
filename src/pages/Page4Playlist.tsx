import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Disc, Play, Pause, Music, Heart, Sparkles, Volume2, VolumeX, SkipBack, SkipForward, Info } from "lucide-react";
import { PlaylistTrack } from "../types";
import { ambientSynth } from "../utils/audioSynth";
import { getAssetUrl } from "../utils/assets";

interface Page4PlaylistProps {
  playlist: PlaylistTrack[];
  onNext: () => void;
  darkMode?: boolean;
}

export const Page4Playlist: React.FC<Page4PlaylistProps> = ({ playlist, onNext, darkMode = false }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioErrorMap, setAudioErrorMap] = useState<Record<string, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        ambientSynth.stop();
        setIsPlaying(false);
      } else {
        // Stop ambient synth if running so audio tracks don't overlap
        ambientSynth.stop();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If direct MP3 play fails, toggle ambient synth
            const state = ambientSynth.toggle();
            setIsPlaying(state);
          });
      }
    } else {
      const state = ambientSynth.toggle();
      setIsPlaying(state);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handlePrevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec === 0) return "0:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const primaryAudio = activeTrack.audioUrl;
  const fallbackAudio = activeTrack.fallbackAudioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const isAudioErr = audioErrorMap[activeTrack.id];

  let activeAudioSrc = (isAudioErr || (primaryAudio && primaryAudio.startsWith("/music/")))
    ? (fallbackAudio || primaryAudio)
    : (primaryAudio || fallbackAudio);

  if (activeAudioSrc && !activeAudioSrc.startsWith("http")) {
    activeAudioSrc = getAssetUrl(activeAudioSrc);
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto flex flex-col justify-center">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        key={activeTrack.id + "-" + (isAudioErr ? "fallback" : "primary")}
        src={activeAudioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNextTrack}
        onError={() => {
          console.warn("Audio media error fired:", activeTrack.id, activeAudioSrc);
          setAudioErrorMap((prev) => ({ ...prev, [activeTrack.id]: true }));
        }}
      />

      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">Page 4 • Dedicated Songs</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          4 Songs Dedicated To You 🎶
        </h2>
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Fetching local MP3 files: <code className="font-mono bg-pink-100 dark:bg-pink-950/60 px-1.5 py-0.5 rounded text-pink-600 dark:text-pink-300">/music/music1.mp3</code> to <code className="font-mono bg-pink-100 dark:bg-pink-950/60 px-1.5 py-0.5 rounded text-pink-600 dark:text-pink-300">music4.mp3</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-10">
        {/* Vinyl Player Section */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Spinning Vinyl Record */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full bg-slate-950 p-3 shadow-2xl flex items-center justify-center relative border-4 border-slate-800"
            >
              {/* Vinyl Grooves */}
              <div className="w-full h-full rounded-full border border-slate-800/80 flex items-center justify-center p-6">
                <div className="w-full h-full rounded-full border border-slate-800/80 flex items-center justify-center p-6">
                  {/* Album Cover Center Badge */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden relative border-2 border-slate-900 shadow-inner">
                    <img
                      src={activeTrack.coverUrl}
                      alt={activeTrack.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-950 border border-slate-700" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tonearm / Needle */}
            <motion.div
              animate={{ rotate: isPlaying ? 22 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-4 right-8 w-24 h-32 pointer-events-none origin-top-right z-10"
            >
              <div className="w-2 h-24 bg-slate-400 rounded-full mx-auto shadow-md transform rotate-12" />
              <div className="w-4 h-6 bg-slate-300 rounded-sm absolute bottom-2 left-6 shadow-md" />
            </motion.div>
          </div>

          {/* Scrubber & Audio Controls */}
          <div className="w-full max-w-xs mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 shrink-0">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <span className="text-[11px] font-mono text-slate-400 shrink-0">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handlePrevTrack}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pink-100 transition-all"
                title="Previous Song"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> Pause Track
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Play Dedicated Track
                  </>
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pink-100 transition-all"
                title="Next Song"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pink-100 transition-all"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-pink-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Equalizer Waveform Animation */}
          {isPlaying && (
            <div className="flex items-end gap-1.5 h-6 mt-4">
              {[40, 80, 50, 100, 60, 90, 70, 30].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                  transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 bg-pink-500 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Track Info Badge */}
          {activeTrack.audioUrl && (
            <div className="mt-3 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/40 text-[11px] text-pink-600 dark:text-pink-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                Source: <code className="font-mono">{activeTrack.audioUrl}</code>
              </span>
            </div>
          )}
        </div>

        {/* Playlist Items Column */}
        <div className="md:col-span-6 space-y-3">
          {playlist.map((track, idx) => {
            const isSelected = idx === currentTrackIndex;

            return (
              <motion.div
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-gradient-to-r from-pink-500/15 to-purple-500/15 border-pink-400 shadow-md scale-[1.02]"
                    : darkMode
                    ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    : "bg-white/60 border-white/80 hover:border-pink-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200 shadow-sm">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{track.title}</h4>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 font-bold">
                        MP3 #{idx + 1}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{track.artist}</p>
                    {track.note && (
                      <p className="text-[11px] italic text-pink-500 mt-0.5 line-clamp-1">"{track.note}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{track.duration}</span>
                  <div
                    className={`p-2 rounded-full ${
                      isSelected ? "bg-pink-500 text-white shadow-md shadow-pink-500/30" : "text-slate-400 hover:text-pink-500"
                    }`}
                  >
                    {isSelected && isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
        >
          Next: 100 Reasons I Appreciated You
        </button>
      </div>
    </div>
  );
};
