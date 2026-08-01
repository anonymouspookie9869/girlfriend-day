import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, CheckCircle, XCircle, Sparkles, Trophy, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { QuizQuestion } from "../types";
import { triggerGrandConfetti } from "../utils/confetti";

interface Page10QuizProps {
  quizQuestions: QuizQuestion[];
  quizAnswered: Record<string, number>;
  onAnswerQuiz: (questionId: string, answerIndex: number) => void;
  onNext: () => void;
  darkMode?: boolean;
}

export const Page10Quiz: React.FC<Page10QuizProps> = ({
  quizQuestions,
  quizAnswered,
  onAnswerQuiz,
  onNext,
  darkMode = false,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const currentQ = quizQuestions[activeQuestionIdx] || quizQuestions[0];
  const selectedAnswer = quizAnswered[currentQ.id];

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== undefined) return;
    onAnswerQuiz(currentQ.id, idx);

    if (idx === currentQ.correctIndex) {
      triggerGrandConfetti();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-pink-500 dark:text-pink-400 uppercase">
          Page 10 • Playful & Personal Quiz
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-rose-300 dark:to-purple-300 bg-clip-text text-transparent">
          Sweet Trivia About Her & Us ✨
        </h2>
        <p className={`text-xs sm:text-sm mt-2 font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          Thoughtfully written questions about her favorite places, dreams, and my real feelings.
        </p>
      </div>

      {/* Quiz Card Container */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-6 sm:p-10 rounded-3xl backdrop-blur-2xl shadow-2xl border mb-8 ${
          darkMode
            ? "bg-slate-900/90 border-slate-800 shadow-slate-950/60"
            : "bg-white/95 border-white/90 shadow-pink-100/80"
        }`}
      >
        {/* Card Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-pink-500 text-white shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Question {activeQuestionIdx + 1} of {quizQuestions.length}</span>
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>Her Special Quiz</span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-xl sm:text-2xl font-serif font-bold mb-6 text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctIndex;
            const hasAnswered = selectedAnswer !== undefined;

            let btnStyle = darkMode
              ? "bg-slate-800/90 border-2 border-slate-700 text-slate-100 hover:border-pink-400 hover:bg-slate-800"
              : "bg-white border-2 border-slate-200 text-slate-900 hover:border-pink-500 hover:bg-pink-50/50 shadow-sm";

            if (hasAnswered) {
              if (isCorrect) {
                btnStyle =
                  "bg-emerald-100/90 dark:bg-emerald-950/90 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 font-bold shadow-md";
              } else if (isSelected && !isCorrect) {
                btnStyle =
                  "bg-rose-100/90 dark:bg-rose-950/90 border-2 border-rose-600 dark:border-rose-400 text-rose-950 dark:text-rose-100 font-bold shadow-md";
              } else {
                btnStyle = darkMode
                  ? "bg-slate-800/40 border-2 border-slate-800 text-slate-400 opacity-60"
                  : "bg-slate-50 border-2 border-slate-200 text-slate-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4.5 rounded-2xl text-left text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <span className="leading-relaxed">{option}</span>
                {hasAnswered && (
                  <div className="shrink-0">
                    {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 fill-rose-100 dark:fill-rose-950" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Note Box */}
        {selectedAnswer !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 dark:from-pink-950/90 dark:via-rose-950/90 dark:to-purple-950/90 border-2 border-pink-300 dark:border-pink-800 text-slate-900 dark:text-slate-100 text-sm shadow-md flex items-start gap-3"
          >
            <span className="px-2.5 py-1 rounded-md bg-pink-600 text-white font-bold text-xs shrink-0 shadow-sm uppercase tracking-wider">
              Note
            </span>
            <p className="font-medium leading-relaxed pt-0.5">
              {currentQ.explanation}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <button
          onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
          disabled={activeQuestionIdx === 0}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-600 dark:hover:bg-pink-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {activeQuestionIdx + 1} / {quizQuestions.length}
        </span>

        <button
          onClick={() => setActiveQuestionIdx((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
          disabled={activeQuestionIdx === quizQuestions.length - 1}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-600 dark:hover:bg-pink-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <span>Next Question</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-lg shadow-pink-500/30 hover:scale-105 transition-all cursor-pointer"
        >
          Next: Music & Memories
        </button>
      </div>
    </div>
  );
};
