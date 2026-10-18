import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  Download,
  RotateCcw,
  Shuffle,
  CheckCircle2,
  BookOpen,
  Flame,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import type {
  FilterOptions,
  StudyProgressState,
  TermEntry,
  RoadmapStageId,
} from './types/atlas.ts';
import { ROADMAP_STAGES, ARCHITECTURE_COMPARISONS } from './data/roadmapData.ts';
import { ALL_TERMS, QUIZ_QUESTIONS, QUICK_ACRONYM_INDEX } from './data/termsData.ts';
import {
  filterTerms,
  calculateOverallStats,
  toggleIdInList,
  getLocalDateString,
  calculateUpdatedStreak,
  getStorageKeyForUser,
} from './utils/studyLogic.ts';
import {
  auth,
  onAuthStateChanged,
  signInWithGooglePopup,
  signOutCurrentUser,
  fetchUserStudyProgress,
  syncUserStudyProgressToFirestore,
  type User,
} from './lib/firebase.ts';
import { HomeInteractiveSection } from './components/HomeInteractiveSection.tsx';
import { RoadmapSection } from './components/RoadmapSection.tsx';
import { EncyclopediaSection } from './components/EncyclopediaSection.tsx';
import { FlashcardsAndQuizSection } from './components/FlashcardsAndQuizSection.tsx';
import { TermDetailModal } from './components/TermDetailModal.tsx';

const LEGACY_STORAGE_KEY = 'pybackend_atlas_progress_v1';

function createDefaultProgress(): StudyProgressState {
  const today = getLocalDateString();
  return {
    masteredIds: ['api', 'json', 'http'],
    bookmarkedIds: ['drf', 'wsgi-asgi', 'acid', 'jwt'],
    quizHighScore: 0,
    quizAttempts: 0,
    lastStudiedTermId: 'drf',
    streakCount: 1,
    longestStreak: 1,
    lastActiveDate: today,
  };
}

function loadProgressFromLocalStorage(userId?: string | null): StudyProgressState {
  const key = getStorageKeyForUser(userId);
  const fallback = createDefaultProgress();
  try {
    const raw =
      localStorage.getItem(key) ??
      (!userId ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
    if (raw) {
      const parsed = JSON.parse(raw);
      const streakEvaluated = calculateUpdatedStreak(
        parsed.streakCount ?? 1,
        parsed.longestStreak ?? 1,
        parsed.lastActiveDate ?? null,
        getLocalDateString()
      );
      return {
        ...fallback,
        ...parsed,
        streakCount: streakEvaluated.streakCount,
        longestStreak: streakEvaluated.longestStreak,
        lastActiveDate: streakEvaluated.lastActiveDate,
      };
    }
  } catch {
    // Ignore storage read errors
  }
  return fallback;
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  category: 'All',
  roadmapStage: 'All',
  statusFilter: 'all',
  acronymFilter: 'all',
};

const POPULAR_HERO_TERMS = ['drf', 'acid', 'wsgi-asgi', 'jwt', 'cors', 'orm', 'gil'];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [progress, setProgress] = useState<StudyProgressState>(() =>
    loadProgressFromLocalStorage(null)
  );
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [inspectedTerm, setInspectedTerm] = useState<TermEntry | null>(null);
  const [heroQuickQuery, setHeroQuickQuery] = useState<string>('');

  // Listen for Google Auth state changes & load per-user streak/progress
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);

      const localState = loadProgressFromLocalStorage(user?.uid ?? null);
      setProgress(localState);

      if (user) {
        try {
          const remoteData = await fetchUserStudyProgress(user.uid);
          if (remoteData) {
            const today = getLocalDateString();
            const mergedStreak = calculateUpdatedStreak(
              Math.max(localState.streakCount, remoteData.streakCount ?? 1),
              Math.max(localState.longestStreak, remoteData.longestStreak ?? 1),
              remoteData.lastActiveDate ?? localState.lastActiveDate,
              today
            );
            const mergedMastered = Array.from(
              new Set([...localState.masteredIds, ...(remoteData.masteredIds ?? [])])
            );
            const mergedBookmarked = Array.from(
              new Set([...localState.bookmarkedIds, ...(remoteData.bookmarkedIds ?? [])])
            );
            const merged: StudyProgressState = {
              ...localState,
              masteredIds: mergedMastered,
              bookmarkedIds: mergedBookmarked,
              quizHighScore: Math.max(
                localState.quizHighScore,
                remoteData.quizHighScore ?? 0
              ),
              quizAttempts: Math.max(
                localState.quizAttempts,
                remoteData.quizAttempts ?? 0
              ),
              streakCount: mergedStreak.streakCount,
              longestStreak: mergedStreak.longestStreak,
              lastActiveDate: mergedStreak.lastActiveDate,
            };
            setProgress(merged);
            await syncUserStudyProgressToFirestore(user, merged);
          } else {
            await syncUserStudyProgressToFirestore(user, localState);
          }
        } catch {
          // Local storage remains authoritative fallback if offline
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Persist to per-user localStorage key whenever progress or user changes
  useEffect(() => {
    const key = getStorageKeyForUser(currentUser?.uid ?? null);
    try {
      localStorage.setItem(key, JSON.stringify(progress));
      if (!currentUser) {
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(progress));
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [progress, currentUser]);

  // Helper to update progress, refresh today's activity streak, and sync to Firestore
  const applyUserActivityUpdate = useCallback(
    (updater: (prev: StudyProgressState) => StudyProgressState) => {
      setProgress((prev) => {
        const nextBase = updater(prev);
        const streakEval = calculateUpdatedStreak(
          nextBase.streakCount,
          nextBase.longestStreak,
          nextBase.lastActiveDate,
          getLocalDateString()
        );
        const updated: StudyProgressState = {
          ...nextBase,
          streakCount: streakEval.streakCount,
          longestStreak: streakEval.longestStreak,
          lastActiveDate: streakEval.lastActiveDate,
        };
        if (currentUser) {
          syncUserStudyProgressToFirestore(currentUser, updated).catch(() => {});
        }
        return updated;
      });
    },
    [currentUser]
  );

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithGooglePopup();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in was cancelled.';
      if (!msg.includes('popup-closed-by-user')) {
        setAuthError('Unable to complete Google sign-in. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    setAuthError(null);
    try {
      await signOutCurrentUser();
    } catch {
      setAuthError('Unable to sign out right now.');
    }
  };

  const filteredTerms = useMemo(
    () => filterTerms(ALL_TERMS, filters, progress),
    [filters, progress]
  );

  const overallStats = useMemo(
    () => calculateOverallStats(ALL_TERMS, progress),
    [progress]
  );

  const heroQuickResults = useMemo(() => {
    const q = heroQuickQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.fullForm.toLowerCase().includes(q) ||
        t.shortSummary.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [heroQuickQuery]);

  const handleToggleMastered = (termId: string) => {
    applyUserActivityUpdate((prev) => ({
      ...prev,
      masteredIds: toggleIdInList(prev.masteredIds, termId),
      lastStudiedTermId: termId,
    }));
  };

  const handleToggleBookmark = (termId: string) => {
    applyUserActivityUpdate((prev) => ({
      ...prev,
      bookmarkedIds: toggleIdInList(prev.bookmarkedIds, termId),
    }));
  };

  const handleRecordQuizScore = (percentage: number) => {
    applyUserActivityUpdate((prev) => ({
      ...prev,
      quizHighScore: Math.max(prev.quizHighScore, percentage),
      quizAttempts: prev.quizAttempts + 1,
    }));
  };

  const handleInspectTerm = (term: TermEntry | null) => {
    setInspectedTerm(term);
    if (term) {
      applyUserActivityUpdate((prev) => ({
        ...prev,
        lastStudiedTermId: term.id,
      }));
    }
  };

  const handleUpdateFilters = (partial: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSelectStageFromRoadmap = (stage: RoadmapStageId) => {
    setFilters({
      ...DEFAULT_FILTERS,
      roadmapStage: stage,
    });
    const el = document.getElementById('encyclopedia');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromHome = (category: FilterOptions['category']) => {
    setFilters({
      ...DEFAULT_FILTERS,
      category,
    });
    const el = document.getElementById('encyclopedia');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenRandomInterviewTerm = () => {
    const unmasteredPool = ALL_TERMS.filter(
      (t) => !progress.masteredIds.includes(t.id)
    );
    const pool = unmasteredPool.length > 0 ? unmasteredPool : ALL_TERMS;
    const randomTerm = pool[Math.floor(Math.random() * pool.length)];
    if (randomTerm) {
      handleInspectTerm(randomTerm);
    }
  };

  const handleResetStudyProgress = () => {
    const today = getLocalDateString();
    const resetState: StudyProgressState = {
      masteredIds: [],
      bookmarkedIds: [],
      quizHighScore: 0,
      quizAttempts: 0,
      lastStudiedTermId: null,
      streakCount: 1,
      longestStreak: progress.longestStreak,
      lastActiveDate: today,
    };
    setProgress(resetState);
    if (currentUser) {
      syncUserStudyProgressToFirestore(currentUser, resetState).catch(() => {});
    }
  };

  const handleDownloadMarkdownGuide = () => {
    const lines: string[] = [
      '# PyBackend Atlas — Developer Full-Forms Roadmap & Interview Study Guide',
      '',
      '## 5-Stage Learning Roadmap (What to Remember First)',
      '',
    ];
    for (const st of ROADMAP_STAGES) {
      lines.push(`### ${st.title} (${st.timeframe})`);
      lines.push(`- **Focus**: ${st.focusSummary}`);
      lines.push(`- **Interview Milestone**: ${st.interviewMilestone}`);
      lines.push('');
    }
    lines.push('---', '', '## Deep-Dive Encyclopedia & Interview Q&A', '');
    for (const t of ALL_TERMS) {
      lines.push(`### ${t.term} — ${t.fullForm}`);
      lines.push(
        `Stage 0${t.roadmapStage} · ${t.category} · ${
          t.isAcronym ? 'Acronym' : 'Technical Term'
        }`
      );
      lines.push('');
      lines.push(`**Definition**: ${t.detailedDefinition}`);
      lines.push('');
      lines.push(`**Where & Why Used**: ${t.whereAndWhyUsed}`);
      lines.push('');
      lines.push(`**Real-World Python Example**: ${t.realWorldExample}`);
      lines.push('');
      for (const qa of t.interviewQuestions) {
        lines.push(`- **Q (${qa.questionType})**: ${qa.question}`);
        lines.push(`  - **A**: ${qa.answer}`);
      }
      lines.push('');
    }

    const blob = new Blob([lines.join('\n')], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python-backend-fullforms-interview-guide.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeDateFormatted = progress.lastActiveDate ?? getLocalDateString();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* ================================================================= */}
      {/* TOP BAR CONTRACT: 3 ZONES SEPARATED BY GAP-8                      */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            PyBackend Atlas
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#roadmap"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Visual Roadmap
            </a>
            <a
              href="#home-lab"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Interactive Lab
            </a>
            <a
              href="#encyclopedia"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Encyclopedia
            </a>
            <a
              href="#flashcards"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Flashcards
            </a>
            <a
              href="#quiz"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Interview Quiz
            </a>
          </nav>

          {/* Zone 3: 1 primary action (Google Login / Sign Out per-user session) */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <button
                type="button"
                onClick={handleGoogleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate">
                  Sign Out ({currentUser.displayName?.split(' ')[0] || 'User'})
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isSigningIn ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN CONTENT VIEWPORT                                             */}
      {/* ================================================================= */}
      <main
        id="top"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-12 sm:space-y-16"
      >
        {/* Mobile In-Page Section Jump Bar (Non-sticky, thumb-friendly for phones) */}
        <nav
          aria-label="Mobile section navigation"
          className="md:hidden grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white border border-slate-200 rounded-xl p-2"
        >
          <a
            href="#home-lab"
            className="text-center py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            01. Request Lab
          </a>
          <a
            href="#roadmap"
            className="text-center py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            02. Roadmap
          </a>
          <a
            href="#encyclopedia"
            className="text-center py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            03. Encyclopedia
          </a>
          <a
            href="#flashcards"
            className="text-center py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            04. Flashcards
          </a>
          <a
            href="#quiz"
            className="col-span-2 sm:col-span-1 text-center py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            05. Interview Quiz
          </a>
        </nav>

        {/* Hero Split Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Hero Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-700">
                <span>Python Backend & System Design Handbook</span>
                <span aria-hidden="true">·</span>
                <span>Django · DRF · FastAPI · SQL · Cloud</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Master Developer Full-Forms, Architecture Flows & Interview Answers
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Memorizing that <strong className="text-slate-900">DRF</strong> means{' '}
                <em>Django REST Framework</em> or <strong className="text-slate-900">ACID</strong>{' '}
                means <em>Atomicity, Consistency, Isolation, Durability</em> is only step one.
                Interviewers test <strong className="text-slate-900">where and why</strong> you use
                each concept, how they connect in production, and how you solve edge cases.
              </p>

              {/* Instant Hero Acronym Lookup & Quick Jump */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label
                    htmlFor="hero-instant-lookup"
                    className="text-xs font-bold text-slate-800 whitespace-nowrap shrink-0"
                  >
                    Instant Term Decoder:
                  </label>
                  <input
                    id="hero-instant-lookup"
                    type="search"
                    value={heroQuickQuery}
                    onChange={(e) => setHeroQuickQuery(e.target.value)}
                    placeholder="Type an acronym (e.g. DRF, WSGI, ACID, JWT, CORS)..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600"
                  />
                </div>

                {heroQuickResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {heroQuickResults.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => {
                          handleInspectTerm(res);
                          setHeroQuickQuery('');
                        }}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-600 text-left transition-colors cursor-pointer"
                      >
                        <div className="font-mono text-xs font-bold text-slate-900 truncate">
                          {res.term} — {res.fullForm}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          Stage 0{res.roadmapStage} · Click for full interview Q&A
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-500">Hot Interview Terms:</span>
                    {POPULAR_HERO_TERMS.map((id) => {
                      const entry = ALL_TERMS.find((t) => t.id === id);
                      if (!entry) return null;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => handleInspectTerm(entry)}
                          className="px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 bg-white hover:bg-sky-50 hover:text-sky-700 border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {entry.term}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#roadmap"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Explore Visual Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#home-lab"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Request Simulator</span>
                </a>

                <button
                  type="button"
                  onClick={handleOpenRandomInterviewTerm}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Random Drill</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMarkdownGuide}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .MD Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>100% Responsive & Cloud-Synced</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {ALL_TERMS.length} Deep Dives · {QUICK_ACRONYM_INDEX.length} Quick-Ref Acronyms ·{' '}
                  {overallStats.totalInterviewQuestions} Interview Q&As
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Personal Study Dashboard + Top-Right Daily Study Streak (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Dashboard Header with Top-Right Daily Study Streak Counter */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Your Revision Progress
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {currentUser ? (
                      <span className="truncate max-w-[200px]">
                        Synced as <strong className="text-slate-800">{currentUser.displayName || currentUser.email}</strong>
                      </span>
                    ) : (
                      <span>Guest Session (Local Storage)</span>
                    )}
                  </div>
                </div>

                {/* Top-Right Daily Study Streak Counter */}
                <div
                  data-testid="daily-study-streak"
                  className="bg-amber-50/90 border border-amber-200 rounded-lg px-3 py-2 text-right shrink-0"
                >
                  <div className="flex items-center justify-end gap-1.5 text-amber-900">
                    <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-semibold">Daily Study Streak:</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-amber-950">
                      {progress.streakCount} {progress.streakCount === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-800/90 tabular-nums mt-0.5">
                    Last Active: {activeDateFormatted} · Best: {progress.longestStreak}d
                  </div>
                </div>
              </div>

              {/* Per-User Google Account Callout / Action */}
              {authReady && !currentUser && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs text-slate-600 leading-snug">
                    <strong className="text-slate-900">Stack your streak per user:</strong> Sign in
                    with Google to isolate and sync your streak & mastery across devices.
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{isSigningIn ? 'Signing in...' : 'Google Login'}</span>
                  </button>
                </div>
              )}

              {authError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                  {authError}
                </div>
              )}

              {/* Overall Mastery Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Overall Deep-Dive Mastery
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {overallStats.masteredCount} / {overallStats.totalModules} (
                      {overallStats.masteryPercent}%)
                    </span>
                    {progress.masteredIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleResetStudyProgress}
                        aria-label="Reset mastered modules"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-200"
                    style={{ width: `${overallStats.masteryPercent}%` }}
                  />
                </div>
              </div>

              {/* 3 Compact Stat Cells */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs text-slate-500">Stages Done</div>
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                    {overallStats.completedStagesCount} / 5
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs text-slate-500">Bookmarked</div>
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                    {overallStats.bookmarkedCount}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs text-slate-500">Quiz Best</div>
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                    {progress.quizHighScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Next Recommended Module Card */}
            {overallStats.nextRecommendedTerm ? (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-sky-700">
                    Recommended Next on Roadmap
                  </span>
                  <span className="font-mono">
                    Stage 0{overallStats.nextRecommendedTerm.roadmapStage}
                  </span>
                </div>
                <div>
                  <div className="font-mono text-base font-bold text-slate-900">
                    {overallStats.nextRecommendedTerm.term} —{' '}
                    {overallStats.nextRecommendedTerm.fullForm}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {overallStats.nextRecommendedTerm.shortSummary}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleInspectTerm(overallStats.nextRecommendedTerm)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                  >
                    Study {overallStats.nextRecommendedTerm.term} Now
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      overallStats.nextRecommendedTerm &&
                      handleToggleMastered(overallStats.nextRecommendedTerm.id)
                    }
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    Mark Mastered
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div className="text-xs text-emerald-950">
                  <strong>All 5 Roadmap Stages Mastered!</strong> Keep your edge sharp with the
                  Interview Quiz below.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 1: Visual Flowchart Roadmap (roadmap.sh style), Request Flow & Key Comparisons */}
        <RoadmapSection
          stages={ROADMAP_STAGES}
          terms={ALL_TERMS}
          comparisons={ARCHITECTURE_COMPARISONS}
          masteredIds={progress.masteredIds}
          selectedStage={filters.roadmapStage}
          onSelectStageFilter={handleSelectStageFromRoadmap}
          onInspectTerm={(term) => handleInspectTerm(term)}
          onToggleMastered={handleToggleMastered}
        />

        {/* Interactive Home Lab: Live Request Simulator, Study Planner, Spot-Check & 12-Domain Radar */}
        <HomeInteractiveSection
          terms={ALL_TERMS}
          masteredIds={progress.masteredIds}
          onInspectTerm={(term) => handleInspectTerm(term)}
          onToggleMastered={handleToggleMastered}
          onSelectCategoryFilter={handleSelectCategoryFromHome}
          onSelectStageFilter={handleSelectStageFromRoadmap}
        />

        {/* Section 2: Searchable Deep-Dive Encyclopedia + Master Quick Table */}
        <EncyclopediaSection
          terms={filteredTerms}
          allTerms={ALL_TERMS}
          filters={filters}
          masteredIds={progress.masteredIds}
          bookmarkedIds={progress.bookmarkedIds}
          onUpdateFilters={handleUpdateFilters}
          onResetFilters={handleResetFilters}
          onToggleMastered={handleToggleMastered}
          onToggleBookmark={handleToggleBookmark}
          onInspectTerm={(term) => handleInspectTerm(term)}
        />

        {/* Section 3 & 4: Active-Recall Flashcards & Interactive Interview Quiz */}
        <FlashcardsAndQuizSection
          terms={ALL_TERMS}
          quizQuestions={QUIZ_QUESTIONS}
          masteredIds={progress.masteredIds}
          quizHighScore={progress.quizHighScore}
          onToggleMastered={handleToggleMastered}
          onRecordQuizScore={handleRecordQuizScore}
          onInspectTerm={(term) => handleInspectTerm(term)}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            PyBackend Atlas — Responsive Full-Forms Roadmap & Technical Interview Study Guide
          </div>
          <div className="flex items-center gap-4">
            <a href="#roadmap" className="hover:text-slate-900 transition-colors">
              Roadmap
            </a>
            <a href="#encyclopedia" className="hover:text-slate-900 transition-colors">
              Encyclopedia
            </a>
            <a href="#flashcards" className="hover:text-slate-900 transition-colors">
              Flashcards
            </a>
            <a href="#quiz" className="hover:text-slate-900 transition-colors">
              Interview Quiz
            </a>
          </div>
        </div>
      </footer>

      {/* Focused Deep-Dive Study Modal */}
      <TermDetailModal
        term={inspectedTerm}
        allTerms={ALL_TERMS}
        isMastered={
          inspectedTerm ? progress.masteredIds.includes(inspectedTerm.id) : false
        }
        isBookmarked={
          inspectedTerm ? progress.bookmarkedIds.includes(inspectedTerm.id) : false
        }
        onClose={() => setInspectedTerm(null)}
        onToggleMastered={handleToggleMastered}
        onToggleBookmark={handleToggleBookmark}
        onSelectRelatedTerm={(rel) => handleInspectTerm(rel)}
      />
    </div>
  );
}
