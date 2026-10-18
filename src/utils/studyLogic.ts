import type {
  TermEntry,
  FilterOptions,
  StudyProgressState,
  RoadmapStageId,
  TermCategory,
  QuizQuestion,
} from '../types/atlas.ts';
import type { QuickAcronymRow } from '../data/termsData.ts';

export function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

export function filterTerms(
  terms: TermEntry[],
  filters: FilterOptions,
  progress: Pick<StudyProgressState, 'masteredIds' | 'bookmarkedIds'>
): TermEntry[] {
  const query = normalizeQuery(filters.searchQuery);
  const masteredSet = new Set(progress.masteredIds);
  const bookmarkedSet = new Set(progress.bookmarkedIds);

  return terms.filter((entry) => {
    if (filters.category !== 'All' && entry.category !== filters.category) {
      return false;
    }

    if (filters.roadmapStage !== 'All' && entry.roadmapStage !== filters.roadmapStage) {
      return false;
    }

    if (filters.statusFilter === 'mastered' && !masteredSet.has(entry.id)) {
      return false;
    }
    if (filters.statusFilter === 'unmastered' && masteredSet.has(entry.id)) {
      return false;
    }
    if (filters.statusFilter === 'bookmarked' && !bookmarkedSet.has(entry.id)) {
      return false;
    }

    if (filters.acronymFilter === 'acronyms-only' && !entry.isAcronym) {
      return false;
    }
    if (filters.acronymFilter === 'non-acronyms' && entry.isAcronym) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      entry.term,
      entry.fullForm,
      entry.category,
      entry.shortSummary,
      entry.detailedDefinition,
      entry.whereAndWhyUsed,
      entry.realWorldExample,
      ...entry.interviewQuestions.map((q) => `${q.question} ${q.answer}`),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function filterQuickIndex(
  rows: QuickAcronymRow[],
  searchQuery: string,
  category: TermCategory | 'All',
  stage: RoadmapStageId | 'All'
): QuickAcronymRow[] {
  const query = normalizeQuery(searchQuery);
  return rows.filter((row) => {
    if (category !== 'All' && row.category !== category) return false;
    if (stage !== 'All' && row.stage !== stage) return false;
    if (!query) return true;
    const text = `${row.abbr} ${row.fullForm} ${row.meaning} ${row.category}`.toLowerCase();
    return text.includes(query);
  });
}

export interface StageProgressSummary {
  stageId: RoadmapStageId;
  total: number;
  mastered: number;
  percentage: number;
  isComplete: boolean;
  nextRecommendedTerm: TermEntry | null;
}

export function calculateStageProgress(
  terms: TermEntry[],
  stageId: RoadmapStageId,
  masteredIds: string[]
): StageProgressSummary {
  const masteredSet = new Set(masteredIds);
  const stageTerms = terms.filter((t) => t.roadmapStage === stageId);
  const total = stageTerms.length;
  const mastered = stageTerms.filter((t) => masteredSet.has(t.id)).length;
  const percentage = total === 0 ? 0 : Math.round((mastered / total) * 100);
  const nextRecommendedTerm = stageTerms.find((t) => !masteredSet.has(t.id)) ?? null;

  return {
    stageId,
    total,
    mastered,
    percentage,
    isComplete: total > 0 && mastered === total,
    nextRecommendedTerm,
  };
}

export interface OverallStudyStats {
  totalModules: number;
  masteredCount: number;
  masteryPercent: number;
  bookmarkedCount: number;
  totalInterviewQuestions: number;
  completedStagesCount: number;
  nextRecommendedTerm: TermEntry | null;
}

export function calculateOverallStats(
  terms: TermEntry[],
  progress: Pick<StudyProgressState, 'masteredIds' | 'bookmarkedIds'>
): OverallStudyStats {
  const masteredSet = new Set(progress.masteredIds);
  const totalModules = terms.length;
  const masteredCount = terms.filter((t) => masteredSet.has(t.id)).length;
  const masteryPercent = totalModules === 0 ? 0 : Math.round((masteredCount / totalModules) * 100);
  const totalInterviewQuestions = terms.reduce(
    (sum, t) => sum + t.interviewQuestions.length,
    0
  );

  const stages: RoadmapStageId[] = [1, 2, 3, 4, 5];
  let completedStagesCount = 0;
  let nextRecommendedTerm: TermEntry | null = null;

  for (const s of stages) {
    const summary = calculateStageProgress(terms, s, progress.masteredIds);
    if (summary.isComplete) {
      completedStagesCount += 1;
    } else if (!nextRecommendedTerm && summary.nextRecommendedTerm) {
      nextRecommendedTerm = summary.nextRecommendedTerm;
    }
  }

  return {
    totalModules,
    masteredCount,
    masteryPercent,
    bookmarkedCount: progress.bookmarkedIds.length,
    totalInterviewQuestions,
    completedStagesCount,
    nextRecommendedTerm,
  };
}

export function toggleIdInList(list: string[], id: string): string[] {
  if (list.includes(id)) {
    return list.filter((item) => item !== id);
  }
  return [...list, id];
}

export interface QuizGradeResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  questionBreakdown: {
    questionId: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
  }[];
}

export function gradeQuizSubmission(
  questions: QuizQuestion[],
  selectedAnswers: Record<string, number>
): QuizGradeResult {
  let score = 0;
  const questionBreakdown = questions.map((q) => {
    const selectedIndex =
      selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : null;
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) {
      score += 1;
    }
    return {
      questionId: q.id,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
    };
  });

  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  return {
    score,
    total,
    percentage,
    passed: percentage >= 75,
    questionBreakdown,
  };
}

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCalendarDayDiff(fromDateStr: string, toDateStr: string): number | null {
  if (
    !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(fromDateStr) ||
    !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(toDateStr)
  ) {
    return null;
  }
  const [fY, fM, fD] = fromDateStr.split('-').map(Number);
  const [tY, tM, tD] = toDateStr.split('-').map(Number);
  const fromUtc = Date.UTC(fY, fM - 1, fD);
  const toUtc = Date.UTC(tY, tM - 1, tD);
  const msPerDay = 86400000;
  return Math.round((toUtc - fromUtc) / msPerDay);
}

export interface StreakUpdateResult {
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  status: 'maintained' | 'incremented' | 'reset-to-1';
}

export function calculateUpdatedStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string | null,
  todayDateStr: string = getLocalDateString()
): StreakUpdateResult {
  const safeCurrent = Math.max(0, Math.floor(currentStreak || 0));
  const safeLongest = Math.max(0, Math.floor(longestStreak || 0));

  if (!lastActiveDate) {
    const nextStreak = 1;
    return {
      streakCount: nextStreak,
      longestStreak: Math.max(safeLongest, nextStreak),
      lastActiveDate: todayDateStr,
      status: 'reset-to-1',
    };
  }

  const diffDays = getCalendarDayDiff(lastActiveDate, todayDateStr);

  if (diffDays === 0) {
    const maintained = Math.max(1, safeCurrent);
    return {
      streakCount: maintained,
      longestStreak: Math.max(safeLongest, maintained),
      lastActiveDate: todayDateStr,
      status: 'maintained',
    };
  }

  if (diffDays === 1) {
    const incremented = Math.max(1, safeCurrent) + 1;
    return {
      streakCount: incremented,
      longestStreak: Math.max(safeLongest, incremented),
      lastActiveDate: todayDateStr,
      status: 'incremented',
    };
  }

  return {
    streakCount: 1,
    longestStreak: Math.max(safeLongest, 1),
    lastActiveDate: todayDateStr,
    status: 'reset-to-1',
  };
}

export function getStorageKeyForUser(userId?: string | null): string {
  const cleanUid = userId?.trim();
  if (cleanUid) {
    return `pybackend_atlas_progress_v1_user_${cleanUid}`;
  }
  return 'pybackend_atlas_progress_v1_guest';
}

export interface CategoryBreakdownItem {
  category: TermCategory;
  total: number;
  mastered: number;
  percentage: number;
  sampleTerms: string[];
}

export function calculateCategoryBreakdown(
  terms: TermEntry[],
  categories: TermCategory[],
  masteredIds: string[]
): CategoryBreakdownItem[] {
  const masteredSet = new Set(masteredIds);
  return categories.map((cat) => {
    const catTerms = terms.filter((t) => t.category === cat);
    const total = catTerms.length;
    const mastered = catTerms.filter((t) => masteredSet.has(t.id)).length;
    const percentage = total === 0 ? 0 : Math.round((mastered / total) * 100);
    const sampleTerms = catTerms.slice(0, 4).map((t) => t.term);
    return {
      category: cat,
      total,
      mastered,
      percentage,
      sampleTerms,
    };
  });
}

export type StudyTrackId = 'django-drf' | 'fastapi-async' | 'system-design';

export interface StudySchedulePlan {
  daysAvailable: number;
  track: StudyTrackId;
  remainingModules: number;
  modulesPerDay: number;
  questionsPerDay: number;
  priorityStages: RoadmapStageId[];
  recommendedToday: TermEntry[];
}

export function generateStudySchedule(
  terms: TermEntry[],
  masteredIds: string[],
  daysAvailable: number,
  track: StudyTrackId
): StudySchedulePlan {
  const safeDays = Math.max(1, Math.min(60, Math.floor(daysAvailable || 7)));
  const masteredSet = new Set(masteredIds);

  const trackStageOrder: Record<StudyTrackId, RoadmapStageId[]> = {
    'django-drf': [1, 2, 3, 4, 5],
    'fastapi-async': [1, 4, 2, 3, 5],
    'system-design': [1, 3, 5, 2, 4],
  };

  const priorityStages = trackStageOrder[track] ?? [1, 2, 3, 4, 5];

  const unmastered = terms
    .filter((t) => !masteredSet.has(t.id))
    .sort((a, b) => {
      const idxA = priorityStages.indexOf(a.roadmapStage);
      const idxB = priorityStages.indexOf(b.roadmapStage);
      return idxA - idxB;
    });

  const remainingModules = unmastered.length;
  const modulesPerDay =
    remainingModules === 0 ? 0 : Math.max(1, Math.ceil(remainingModules / safeDays));
  const totalQuestionsRemaining = unmastered.reduce(
    (sum, t) => sum + t.interviewQuestions.length,
    0
  );
  const questionsPerDay =
    totalQuestionsRemaining === 0
      ? 0
      : Math.max(1, Math.ceil(totalQuestionsRemaining / safeDays));

  const recommendedToday = (unmastered.length > 0 ? unmastered : terms).slice(
    0,
    Math.min(4, Math.max(2, modulesPerDay))
  );

  return {
    daysAvailable: safeDays,
    track,
    remainingModules,
    modulesPerDay,
    questionsPerDay,
    priorityStages,
    recommendedToday,
  };
}

export interface VisualRoadmapProgressStats {
  totalNodes: number;
  masteredNodes: number;
  percentage: number;
}

export function calculateVisualRoadmapProgress(
  nodeTermIds: string[],
  masteredIds: string[]
): VisualRoadmapProgressStats {
  const masteredSet = new Set(masteredIds);
  const totalNodes = nodeTermIds.length;
  const masteredNodes = nodeTermIds.filter((id) => masteredSet.has(id)).length;
  const percentage =
    totalNodes === 0 ? 0 : Math.round((masteredNodes / totalNodes) * 100);
  return {
    totalNodes,
    masteredNodes,
    percentage,
  };
}
