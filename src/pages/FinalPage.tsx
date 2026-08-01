import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Sprout, Check, RotateCcw, X, BookOpen, Volume2 } from "lucide-react";
import { FinalResponseType } from "../types";
import { triggerGrandConfetti, triggerConfessionExplosion } from "../utils/confetti";
import { getDeviceInfo, getSessionId } from "../utils/storage";
import { ambientSynth } from "../utils/audioSynth";

interface FinalPageProps {
  initialResponse: FinalResponseType;
  onRecordResponse: (resp: FinalResponseType) => void;
  darkMode?: boolean;
}

export const FinalPage: React.FC<FinalPageProps> = ({
  initialResponse,
  onRecordResponse,
  darkMode = false,
}) => {
  const [chosenResponse, setChosenResponse] = useState<FinalResponseType>(initialResponse);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfessionModal, setShowConfessionModal] = useState(false);

  // Subtle volume-ducking feature when confession modal opens
  useEffect(() => {
    if (showConfessionModal) {
      ambientSynth.setDucked(true, 0.25);
    } else {
      ambientSynth.setDucked(false);
    }
    return () => {
      ambientSynth.setDucked(false);
    };
  }, [showConfessionModal]);

  const handleChoose = async (choice: "Maybe" | "No") => {
    setIsSubmitting(true);
    setChosenResponse(choice);
    onRecordResponse(choice);

    if (choice === "Maybe") {
      triggerGrandConfetti();
    }

    // Send payload to backend
    const session = getSessionId();
    const { device, location } = getDeviceInfo();

    try {
      await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: choice,
          time: new Date().toISOString(),
          device,
          location,
          session,
        }),
      });
    } catch (err) {
      console.error("Failed to post response to server", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetChoice = () => {
    setChosenResponse(null);
    onRecordResponse(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
      <AnimatePresence mode="wait">
        {!chosenResponse ? (
          /* Question Card */
          <motion.div
            key="question-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8 }}
            className={`w-full p-8 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl border relative overflow-hidden ${
              darkMode
                ? "bg-slate-900/80 border-slate-800 shadow-pink-950/30 text-slate-100"
                : "bg-white/80 border-white/90 shadow-rose-200/50 text-slate-800"
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-500 mb-2 block">
              One last question from my heart...
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-6 leading-tight">
              If life ever naturally gives us another chance...
            </h2>

            <p className="text-base sm:text-lg font-serif italic text-pink-600 dark:text-pink-400 mb-10 leading-relaxed max-w-xl mx-auto">
              "Would you ever give me another chance to earn your love, build a real relationship again, and be your man once more?"
            </p>

            {/* Heartfelt Confession trigger button */}
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(244, 63, 94, 0.3), 0 0 30px rgba(236, 72, 153, 0.2)",
                    "0 0 25px rgba(244, 63, 94, 0.6), 0 0 45px rgba(168, 85, 247, 0.4)",
                    "0 0 15px rgba(244, 63, 94, 0.3), 0 0 30px rgba(236, 72, 153, 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-full p-0.5 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500"
              >
                {/* Background Soft-Focus Glow halo */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 opacity-65 blur-md animate-pulse pointer-events-none" />

                <button
                  onClick={() => setShowConfessionModal(true)}
                  className="relative z-10 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-rose-950 dark:text-pink-100 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <BookOpen className="w-4 h-4 text-pink-500 animate-bounce" />
                  <span className="tracking-wide">Read My Heartfelt Confession 💌</span>
                </button>
              </motion.div>
            </div>

            {/* Answer Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                disabled={isSubmitting}
                onClick={() => handleChoose("Maybe")}
                className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-medium text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2 font-semibold">
                  🌸 Maybe — I'm open to another chance
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleChoose("No")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-medium text-sm border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                🌿 I think we're better as we are
              </button>
            </div>
          </motion.div>
        ) : chosenResponse === "Maybe" ? (
          /* Response If She Presses MAYBE */
          <motion.div
            key="response-maybe"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8 }}
            className={`w-full p-8 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl border text-center ${
              darkMode ? "bg-slate-900/80 border-slate-800 text-slate-100" : "bg-white/80 border-white text-slate-800"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/40">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-serif font-bold text-pink-500 mb-4">Thank you.</h3>

            <div className="space-y-4 text-base sm:text-lg font-serif italic leading-relaxed text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
              <p>Thank you from the bottom of my heart.</p>
              <p>No pressure, no expectations. If life ever opens that door again, I promise to give you my absolute best, cherish your love, and be the man you truly deserve.</p>
              <p className="text-xs font-sans not-italic text-slate-400">Until then...</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 font-serif pt-2">
                Happy Girlfriend Day ❤️
              </p>
            </div>

            {/* Change Decision Button & Confession Re-read */}
            <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowConfessionModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-rose-600 dark:text-pink-300 bg-rose-50 dark:bg-pink-950/50 hover:bg-rose-100 dark:hover:bg-pink-900/60 border border-rose-200 dark:border-pink-800/50 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                <span>Read Confession Again 💌</span>
              </button>

              <button
                onClick={handleResetChoice}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Want to change your choice? Choose again</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Response If She Presses NO */
          <motion.div
            key="response-no"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8 }}
            className={`w-full p-8 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl border text-center ${
              darkMode ? "bg-slate-900/80 border-slate-800 text-slate-100" : "bg-white/80 border-white text-slate-800"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sprout className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              Thank you for your honesty.
            </h3>

            <div className="space-y-3 text-base font-serif italic leading-relaxed text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
              <p>That's completely okay.</p>
              <p>This wasn't made to change your mind.</p>
              <p>
                It was simply my way of wishing you a Happy Girlfriend Day and thanking you for the memories we shared.
              </p>
              <p className="font-sans not-italic font-semibold text-emerald-600 dark:text-emerald-400 pt-3">
                I truly wish you happiness. 🌿
              </p>
            </div>

            {/* Change Decision Button & Confession Re-read */}
            <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowConfessionModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-rose-600 dark:text-pink-300 bg-rose-50 dark:bg-pink-950/50 hover:bg-rose-100 dark:hover:bg-pink-900/60 border border-rose-200 dark:border-pink-800/50 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                <span>Read My Confession 💌</span>
              </button>

              <button
                onClick={handleResetChoice}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Want to change your decision? Choose again</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heartfelt Confession Modal */}
      <AnimatePresence>
        {showConfessionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className={`relative w-full max-w-2xl p-6 sm:p-10 rounded-3xl shadow-2xl border my-8 text-left ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-100 shadow-pink-950/50"
                  : "bg-white border-pink-100 text-slate-800 shadow-pink-200/80"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowConfessionModal(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-pink-600 dark:hover:text-pink-300 transition-all cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700/50 active:scale-95 shadow-sm"
                aria-label="Close confession modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3.5 mb-5 pr-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-pink-500 block">
                      A Sincere Reflection
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-pink-950/80 text-rose-600 dark:text-pink-300 border border-rose-200/60 dark:border-pink-800/50">
                      <Volume2 className="w-3 h-3 text-pink-500 animate-pulse" />
                      Music Softened
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-slate-900 dark:text-white leading-snug mt-0.5">
                    Why I Dream of Being Your Man Again 💌
                  </h3>
                </div>
              </div>

              {/* Confession Body with touch-friendly scrolling */}
              <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed sm:leading-loose text-slate-700 dark:text-slate-300 italic border-t border-b border-pink-100 dark:border-slate-800/80 py-5 my-4 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-2.5 overscroll-contain">
                <p>
                  "Looking back, every single moment I spent with you was a gift I never took for granted. I didn't just fall in love with our laughter, our quiet late-night talks, or our shared coffee walks—I fell in love with the kind, genuine, incredible soul that you are."
                </p>
                <p>
                  "Time and reflection have taught me so much. I have grown, matured, and realized what true love really demands: endless patience, deep listening, protecting your peace, and being a steady anchor in your world."
                </p>
                <p>
                  "I don't just want a title; I want the honor of earning your trust step by step. I want to celebrate every dream you chase, hold your hand through life's storms, and bring a smile to your face every single day."
                </p>
                <p>
                  "If life ever grants us the grace of a fresh start, I promise to love you softer, cherish you deeper, and be the supportive, faithful partner you truly deserve."
                </p>
                <p className="not-italic font-sans text-xs font-semibold text-pink-600 dark:text-pink-400 pt-2">
                  No matter what the future holds, my gratitude and warmth for you will never fade.
                </p>
              </div>

              {/* Modal Footer with touch-friendly 48px target */}
              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => {
                    triggerConfessionExplosion();
                    setShowConfessionModal(false);
                  }}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit with Love ❤️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
