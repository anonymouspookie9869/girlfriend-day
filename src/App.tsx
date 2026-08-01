import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LockScreen } from "./components/LockScreen";
import { ParticleBackground } from "./components/ParticleBackground";
import { Butterflies } from "./components/Butterflies";
import { CursorGlow } from "./components/CursorGlow";
import { Navigation } from "./components/Navigation";
import { WelcomeBackModal } from "./components/WelcomeBackModal";

import { IntroPage } from "./pages/IntroPage";
import { Page1Quote } from "./pages/Page1Quote";
import { Page2Timeline } from "./pages/Page2Timeline";
import { Page3Gallery } from "./pages/Page3Gallery";
import { Page4Playlist } from "./pages/Page4Playlist";
import { Page5Reasons } from "./pages/Page5Reasons";
import { Page6MemoryBook } from "./pages/Page6MemoryBook";
import { Page7FlowerGarden } from "./pages/Page7FlowerGarden";
import { Page8StarrySky } from "./pages/Page8StarrySky";
import { Page9HiddenMessages } from "./pages/Page9HiddenMessages";
import { Page10Quiz } from "./pages/Page10Quiz";
import { Page11MusicMemories } from "./pages/Page11MusicMemories";
import { Page12Letter } from "./pages/Page12Letter";
import { FinalPage } from "./pages/FinalPage";

import { defaultContent } from "./data/defaultContent";
import { AppContentData, AppSavedProgress, FinalResponseType } from "./types";
import { loadSavedProgress, saveProgress, getSessionId, getDeviceInfo } from "./utils/storage";
import { ambientSynth } from "./utils/audioSynth";

export default function App() {
  const [content, setContent] = useState<AppContentData>(defaultContent);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Interactive user progress states
  const [openedFlowers, setOpenedFlowers] = useState<string[]>([]);
  const [openedStars, setOpenedStars] = useState<string[]>([]);
  const [foundHearts, setFoundHearts] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState<Record<string, number>>({});
  const [finalResponse, setFinalResponse] = useState<FinalResponseType>(null);

  // Modals & Drawers
  const [welcomeBackOpen, setWelcomeBackOpen] = useState(false);
  const [savedPage, setSavedPage] = useState<number | null>(null);

  // Load custom content or progress on initial load
  useEffect(() => {
    // Notify server of website open
    const session = getSessionId();
    const { device, location } = getDeviceInfo();
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "Website opened",
        time: new Date().toLocaleString(),
        device,
        location,
        session,
      }),
    }).catch((e) => console.log("Notify error", e));

    // Load saved progress
    const saved = loadSavedProgress();
    if (saved) {
      if (saved.isUnlocked) {
        setIsUnlocked(true);
      }
      if (saved.darkMode) {
        setDarkMode(true);
      }
      setOpenedFlowers(saved.openedFlowers || []);
      setOpenedStars(saved.openedStars || []);
      setFoundHearts(saved.foundHearts || []);
      setQuizAnswered(saved.quizAnswered || {});
      setFinalResponse(saved.finalResponse || null);

      if (saved.currentPage && saved.currentPage > 0) {
        setSavedPage(saved.currentPage);
        setWelcomeBackOpen(true);
      }
    }
  }, []);

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textareas
      if (
        ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName) ||
        welcomeBackOpen ||
        !isUnlocked
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        setCurrentPage((prev) => Math.min(13, prev + 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        setCurrentPage((prev) => Math.max(0, prev - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [welcomeBackOpen, isUnlocked]);

  // Save progress whenever key state changes
  useEffect(() => {
    if (isUnlocked) {
      saveProgress({
        currentPage,
        isUnlocked,
        openedFlowers,
        openedStars,
        foundHearts,
        quizAnswered,
        musicEnabled: musicPlaying,
        darkMode,
        finalResponse,
      });
    }
  }, [
    currentPage,
    isUnlocked,
    openedFlowers,
    openedStars,
    foundHearts,
    quizAnswered,
    musicPlaying,
    darkMode,
    finalResponse,
  ]);

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    saveProgress({ isUnlocked: true });
  };

  const handleToggleMusic = () => {
    const isPlaying = ambientSynth.toggle();
    setMusicPlaying(isPlaying);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenFlower = (flowerId: string) => {
    setOpenedFlowers((prev) => [...prev, flowerId]);
  };

  const handleOpenStar = (starId: string) => {
    setOpenedStars((prev) => [...prev, starId]);
  };

  const handleFindHeart = (heartId: string) => {
    setFoundHearts((prev) => [...prev, heartId]);
  };

  const handleAnswerQuiz = (questionId: string, answerIndex: number) => {
    setQuizAnswered((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleRecordFinalResponse = (response: FinalResponseType) => {
    setFinalResponse(response);
  };

  // Render active page
  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <IntroPage onNext={() => handlePageChange(1)} darkMode={darkMode} />;
      case 1:
        return <Page1Quote onNext={() => handlePageChange(2)} darkMode={darkMode} />;
      case 2:
        return (
          <Page2Timeline
            timeline={content.timeline}
            onNext={() => handlePageChange(3)}
            darkMode={darkMode}
          />
        );
      case 3:
        return (
          <Page3Gallery
            photos={content.photos}
            onNext={() => handlePageChange(4)}
            darkMode={darkMode}
          />
        );
      case 4:
        return (
          <Page4Playlist
            playlist={content.playlist}
            onNext={() => handlePageChange(5)}
            darkMode={darkMode}
          />
        );
      case 5:
        return (
          <Page5Reasons
            reasons={content.reasons}
            onNext={() => handlePageChange(6)}
            darkMode={darkMode}
          />
        );
      case 6:
        return (
          <Page6MemoryBook
            bookPages={content.bookPages}
            onNext={() => handlePageChange(7)}
            darkMode={darkMode}
          />
        );
      case 7:
        return (
          <Page7FlowerGarden
            flowers={content.flowers}
            openedFlowers={openedFlowers}
            onOpenFlower={handleOpenFlower}
            onNext={() => handlePageChange(8)}
            darkMode={darkMode}
          />
        );
      case 8:
        return (
          <Page8StarrySky
            starWishes={content.starWishes}
            openedStars={openedStars}
            onOpenStar={handleOpenStar}
            onNext={() => handlePageChange(9)}
            darkMode={darkMode}
          />
        );
      case 9:
        return (
          <Page9HiddenMessages
            hiddenMessages={content.hiddenMessages}
            foundHearts={foundHearts}
            onFindHeart={handleFindHeart}
            onNext={() => handlePageChange(10)}
            darkMode={darkMode}
          />
        );
      case 10:
        return (
          <Page10Quiz
            quizQuestions={content.quizQuestions}
            quizAnswered={quizAnswered}
            onAnswerQuiz={handleAnswerQuiz}
            onNext={() => handlePageChange(11)}
            darkMode={darkMode}
          />
        );
      case 11:
        return (
          <Page11MusicMemories
            photos={content.photos}
            onNext={() => handlePageChange(12)}
            darkMode={darkMode}
          />
        );
      case 12:
        return (
          <Page12Letter
            letterText={content.letterText}
            onNext={() => handlePageChange(13)}
            darkMode={darkMode}
          />
        );
      case 13:
        return (
          <FinalPage
            initialResponse={finalResponse}
            onRecordResponse={handleRecordFinalResponse}
            darkMode={darkMode}
          />
        );
      default:
        return <IntroPage onNext={() => handlePageChange(1)} darkMode={darkMode} />;
    }
  };

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-500 overflow-x-hidden select-none ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 text-slate-800"
      }`}
    >
      {/* Background Interactive Layer */}
      <ParticleBackground darkMode={darkMode} />
      <Butterflies />
      <CursorGlow />

      {/* Lock Screen overlay */}
      {!isUnlocked && (
        <LockScreen onUnlockSuccess={handleUnlockSuccess} darkMode={darkMode} />
      )}

      {/* Main Unlocked Application */}
      {isUnlocked && (
        <>
          <Navigation
            currentPage={currentPage}
            totalPages={14}
            onPageChange={handlePageChange}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            musicPlaying={musicPlaying}
            onToggleMusic={handleToggleMusic}
          />

          <main id="exportable-content" className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Welcome Back Resume Modal */}
          <WelcomeBackModal
            isOpen={welcomeBackOpen}
            savedPage={savedPage || 1}
            pageTitle={savedPage ? ["Intro", "Quote", "Timeline", "Gallery", "Playlist", "Reasons", "Memory Book", "Flower Garden", "Starry Sky", "Hidden Messages", "Mini Quiz", "Music & Memories", "Letter", "Final Question"][savedPage] || "Memory" : "Memory"}
            onResume={() => {
              if (savedPage) setCurrentPage(savedPage);
              setWelcomeBackOpen(false);
            }}
            onStartOver={() => {
              setCurrentPage(0);
              setWelcomeBackOpen(false);
            }}
            darkMode={darkMode}
          />
        </>
      )}
    </div>
  );
}

