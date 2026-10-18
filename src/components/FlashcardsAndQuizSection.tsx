import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ExternalLink,
} from 'lucide-react';
import {
  TermEntry,
  QuizQuestion,
  RoadmapStageId,
} from '../types/atlas.ts';
import { gradeQuizSubmission } from '../utils/studyLogic.ts';

interface FlashcardsAndQuizSectionProps {
  terms: TermEntry[];
  quizQuestions: QuizQuestion[];
  masteredIds: string[];
  quizHighScore: number;
  onToggleMastered: (termId: string) => void;
  onRecordQuizScore: (percentage: number) => void;
  onInspectTerm: (term: TermEntry) => void;
}

export const FlashcardsAndQuizSection: React.FC<FlashcardsAndQuizSectionProps> = ({
  terms,
  quizQuestions,
  masteredIds,
  quizHighScore,
  onToggleMastered,
  onRecordQuizScore,
  onInspectTerm,
}) => {
  // Flashcard state
  const [deckStage, setDeckStage] = useState<RoadmapStageId | 'All'>('All');
  const [unmasteredOnly, setUnmasteredOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const masteredSet = new Set(masteredIds);

  const deck = useMemo(() => {
    return terms.filter((t) => {
      if (deckStage !== 'All' && t.roadmapStage !== deckStage) return false;
      if (unmasteredOnly && masteredSet.has(t.id)) return false;
      return true;
    });
  }, [terms, deckStage, unmasteredOnly, masteredIds]);

  const safeIndex = deck.length === 0 ? 0 : Math.min(currentIndex, deck.length - 1);
  const activeCard = deck[safeIndex] ?? null;

  const handleNextCard = () => {
    if (deck.length === 0) return;
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrevCard = () => {
    if (deck.length === 0) return;
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleMasterAndAdvance = () => {
    if (!activeCard) return;
    if (!masteredSet.has(activeCard.id)) {
      onToggleMastered(activeCard.id);
    }
    setIsRevealed(false);
    if (!unmasteredOnly && deck.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }
  };

  // Quiz handlers
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const quizGrade = useMemo(
    () => gradeQuizSubmission(quizQuestions, selectedAnswers),
    [quizQuestions, selectedAnswers]
  );

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    onRecordQuizScore(quizGrade.percentage);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-16">
      {/* ========================================== */}
      {/* PART A: ACTIVE RECALL FLASHCARDS           */}
      {/* ========================================== */}
      <section id="flashcards" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
              <span>Active Recall Drill</span>
              <span aria-hidden="true">·</span>
              <span>Mobile & Desktop Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              03. Rapid Flashcard Drill (Full Form + Interview Prompt)
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Test yourself before revealing the answer: state the full form out loud, explain where you would use it in a Python backend, and answer the interviewer’s question.
            </p>
          </div>

          {/* Deck Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              aria-label="Filter flashcard deck by stage"
              value={deckStage}
              onChange={(e) => {
                const val = e.target.value;
                setDeckStage(val === 'All' ? 'All' : (Number(val) as RoadmapStageId));
                setCurrentIndex(0);
                setIsRevealed(false);
              }}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-600"
            >
              <option value="All">Deck: All 5 Stages ({terms.length})</option>
              <option value="1">Stage 01: Core Web & APIs</option>
              <option value="2">Stage 02: Security & Auth</option>
              <option value="3">Stage 03: Databases & Caching</option>
              <option value="4">Stage 04: Python Runtime & DevOps</option>
              <option value="5">Stage 05: System Design & Architecture</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setUnmasteredOnly((prev) => !prev);
                setCurrentIndex(0);
                setIsRevealed(false);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                unmasteredOnly
                  ? 'bg-sky-600 border-sky-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {unmasteredOnly ? 'Showing: Unmastered Only' : 'Filter: Unmastered Only'}
            </button>
          </div>
        </div>

        {activeCard ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            {/* Card Progress Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  Card {safeIndex + 1} of {deck.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-sky-700 font-semibold">
                  Stage 0{activeCard.roadmapStage}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeCard.category}</span>
              </div>

              <div className="font-medium">
                {masteredSet.has(activeCard.id) ? (
                  <span className="text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Marked Mastered
                  </span>
                ) : (
                  <span className="text-slate-500">Not Yet Mastered</span>
                )}
              </div>
            </div>

            {/* Card Prompt Body */}
            <div className="py-4 space-y-4">
              <div className="text-xs font-semibold text-slate-500">
                What does this term stand for, where is it used, and how would you answer this interview question?
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-900">
                {activeCard.term}
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="text-xs font-mono font-semibold text-sky-700">
                  Interviewer Prompt:
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900">
                  "{activeCard.interviewQuestions[0]?.question}"
                </p>
              </div>
            </div>

            {/* Revealed Answer Area */}
            {isRevealed ? (
              <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Full Form / Classification</div>
                  <div className="text-lg sm:text-xl font-bold text-sky-800 mt-0.5">
                    {activeCard.fullForm}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200/80">
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      Clear Definition & Where Used
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {activeCard.shortSummary} {activeCard.whereAndWhyUsed}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      Real-World Python Example
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {activeCard.realWorldExample}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80">
                  <div className="text-xs font-bold text-slate-900 mb-1">
                    Model Interview Answer:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {activeCard.interviewQuestions[0]?.answer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50/70 border border-dashed border-slate-300 text-center">
                <p className="text-xs sm:text-sm text-slate-600 mb-3">
                  Think of your answer first, then reveal the full expansion, real-world Python example, and model interview response.
                </p>
                <button
                  type="button"
                  onClick={() => setIsRevealed(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Full Form & Model Answer</span>
                </button>
              </div>
            )}

            {/* Flashcard Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isRevealed && (
                  <button
                    type="button"
                    onClick={() => setIsRevealed(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Answer</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleMasterAndAdvance}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Mastered & Next</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
            <p className="text-base font-bold text-slate-900">
              All flashcards in this filter are already marked Mastered!
            </p>
            <button
              type="button"
              onClick={() => setUnmasteredOnly(false)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Review All Cards in Deck
            </button>
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* PART B: INTERACTIVE INTERVIEW QUIZ         */}
      {/* ========================================== */}
      <section id="quiz" className="scroll-mt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
              <span>Interactive Backend Screening</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{quizQuestions.length} Questions</span>
              {quizHighScore > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                    Best Score: {quizHighScore}%
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              04. Python Backend Terminology & Scenario Quiz
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Simulate a real technical screening: each question tests both the acronym expansion and a practical production scenario (ORM N+1, WSGI vs ASGI, ACID, JWT security, CORS preflight, Idempotency, GIL, and CQRS).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-600 tabular-nums">
              {answeredCount} / {quizQuestions.length} Answered
            </span>
            {Object.keys(selectedAnswers).length > 0 && (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Quiz Score Summary Banner (when submitted or all answered) */}
        {(quizSubmitted || answeredCount === quizQuestions.length) && (
          <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <Award className="w-4 h-4" />
                <span>Quiz Results Summary</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
                Score: {quizGrade.score} / {quizGrade.total} ({quizGrade.percentage}%)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {quizGrade.passed
                  ? 'Strong backend readiness! Review the interview tips below or mark remaining modules as mastered.'
                  : 'Keep practicing! Click "Inspect Study Card" on any missed question below to review the full explanation.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetQuiz}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Quiz Again</span>
            </button>
          </div>
        )}

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizQuestions.map((q, qIdx) => {
            const picked = selectedAnswers[q.id];
            const isAnswered = picked !== undefined;
            const isCorrect = picked === q.correctIndex;
            const linkedTerm = terms.find((t) => t.id === q.termId);

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        Question {qIdx + 1}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-sky-700 font-semibold">
                        {q.term}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Stage 0{q.roadmapStage}</span>
                    </div>

                    {linkedTerm && (
                      <button
                        type="button"
                        onClick={() => onInspectTerm(linkedTerm)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
                      >
                        <span>Study Card</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.prompt}
                  </h3>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = picked === optIdx;
                      const isThisRight = optIdx === q.correctIndex;

                      let btnStyle =
                        'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
                      if (isAnswered) {
                        if (isThisRight) {
                          btnStyle =
                            'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                        } else if (isThisSelected && !isThisRight) {
                          btnStyle =
                            'bg-red-50 border-red-300 text-red-900';
                        } else {
                          btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          {isAnswered && isThisRight && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {isAnswered && isThisSelected && !isThisRight && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <div
                    className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-slate-900'
                    }`}
                  >
                    <div className="font-bold">
                      {isCorrect ? 'Correct! ' : 'Review Explanation: '}
                    </div>
                    <p className="leading-relaxed text-slate-700">
                      {q.explanation}
                    </p>
                    <p className="leading-relaxed text-slate-800 pt-1 border-t border-slate-200/60">
                      <strong>Interview Pro-Tip:</strong> {q.realWorldTip}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!quizSubmitted && answeredCount > 0 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleSubmitQuiz}
              className="px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
            >
              Grade & Save Quiz Score ({answeredCount}/{quizQuestions.length} Answered)
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
