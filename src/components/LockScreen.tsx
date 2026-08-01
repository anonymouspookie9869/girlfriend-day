import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, KeyRound, Sparkles, Heart, HelpCircle, Lightbulb } from "lucide-react";
import { getDeviceInfo, getSessionId } from "../utils/storage";
import { notifyPasswordUnlocked } from "../utils/discordNotifier";

interface LockScreenProps {
  onUnlockSuccess: () => void;
  darkMode?: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlockSuccess, darkMode = false }) => {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setErrorMsg("");

    const session = getSessionId();
    const { device, location } = getDeviceInfo();

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, session, device, location }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocking(true);
        setTimeout(() => {
          onUnlockSuccess();
        }, 1100);
      } else {
        setIsShaking(true);
        setErrorMsg(data.message || "Incorrect password");
        setTimeout(() => setIsShaking(false), 600);
      }
    } catch (err) {
      console.error(err);
      // Fallback client check if server is offline
      const input = password.trim().toLowerCase();
      if (input === "forever" || input === "love" || input === "happy" || input === "memory") {
        notifyPasswordUnlocked().catch(() => {});
        setIsUnlocking(true);
        setTimeout(() => onUnlockSuccess(), 1100);
      } else {
        setIsShaking(true);
        setErrorMsg("Incorrect password. Hint: Try 'forever'");
        setTimeout(() => setIsShaking(false), 600);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {!isUnlocking ? (
        <motion.div
          key="lockscreen-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            darkMode ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-pink-50 via-purple-50 to-rose-100 text-slate-800"
          }`}
        >
          {/* Glass Card Container */}
          <motion.div
            animate={isShaking ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            className={`relative w-full max-w-md overflow-hidden rounded-3xl p-8 backdrop-blur-2xl shadow-2xl border ${
              darkMode
                ? "bg-slate-900/60 border-slate-800 shadow-pink-950/20"
                : "bg-white/60 border-white/80 shadow-rose-200/50"
            }`}
          >
            {/* Ambient Top Glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-400/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30"
              >
                <Lock className="w-8 h-8" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold tracking-tight mb-2 font-serif"
              >
                This page was made especially for you <Heart className="inline w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
              >
                A gentle, quiet space filled with appreciation and warmth.
              </motion.p>

              {/* Password Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                  <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the secret password..."
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all border ${
                      darkMode
                        ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500 focus:border-pink-500/80 focus:ring-2 focus:ring-pink-500/20"
                        : "bg-white/80 border-slate-200/80 text-slate-800 placeholder-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 shadow-inner"
                    }`}
                  />
                </div>

                {errorMsg && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-rose-500">
                    {errorMsg}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !password.trim()}
                  className="group relative w-full py-3.5 px-6 rounded-2xl font-medium text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Unlock Experience <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </span>
                  {/* Glass Shimmer on Button */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                </button>
              </form>

              {/* Hint Trigger & Card */}
              <div className="mt-5 w-full flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className={`text-xs font-medium flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    darkMode
                      ? "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-pink-300"
                      : "bg-white/90 border-pink-200/80 text-pink-600 hover:bg-pink-50 hover:border-pink-300 shadow-xs"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-pink-500" />
                  {showHint ? "Hide hint" : "Need a hint?"}
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`w-full p-3.5 rounded-2xl border text-xs text-center flex flex-col items-center gap-2 overflow-hidden ${
                        darkMode
                          ? "bg-pink-950/30 border-pink-900/40 text-pink-200"
                          : "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200/80 text-pink-800 shadow-sm"
                      }`}
                    >
                      <p className="font-medium flex items-center justify-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                        Secret Hint: The password is <span className="font-mono font-bold underline bg-pink-100 dark:bg-pink-900/60 px-1.5 py-0.5 rounded text-pink-600 dark:text-pink-300">forever</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPassword("forever");
                          setErrorMsg("");
                        }}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:text-pink-400 dark:hover:text-pink-300 underline cursor-pointer transition-colors"
                      >
                        Auto-fill "forever"
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        /* Glass Door Opening Effect */
        <motion.div key="glass-doors" className="fixed inset-0 z-50 pointer-events-none flex">
          {/* Left Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            className={`w-1/2 h-full border-r ${
              darkMode ? "bg-slate-950 border-slate-800" : "bg-gradient-to-r from-pink-100 to-purple-100 border-white"
            }`}
          />
          {/* Right Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            className={`w-1/2 h-full border-l ${
              darkMode ? "bg-slate-950 border-slate-800" : "bg-gradient-to-l from-pink-100 to-purple-100 border-white"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
