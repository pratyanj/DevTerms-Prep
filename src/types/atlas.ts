export type RoadmapStageId = 1 | 2 | 3 | 4 | 5;

export type TermCategory =
  | 'Common Development'
  | 'Backend & APIs'
  | 'Python Ecosystem'
  | 'Databases & SQL'
  | 'Architecture & System Design'
  | 'DevOps & Cloud'
  | 'Frontend & Web'
  | 'Testing & Quality'
  | 'Security & Auth'
  | 'Messaging & Caching'
  | 'Data Formats'
  | 'Product & Business';

export interface InterviewQA {
  question: string;
  answer: string;
  questionType: 'Full Form & Definition' | 'Where & Why Used' | 'Deep-Dive Follow-Up';
}

export interface TermEntry {
  id: string;
  term: string;
  fullForm: string;
  isAcronym: boolean;
  category: TermCategory;
  roadmapStage: RoadmapStageId;
  priority: 'Critical' | 'High' | 'Essential';
  shortSummary: string;
  detailedDefinition: string;
  whereAndWhyUsed: string;
  realWorldExample: string;
  codeSnippet?: string;
  interviewQuestions: InterviewQA[];
  relatedTerms: string[];
}

export interface RoadmapStage {
  id: RoadmapStageId;
  title: string;
  subtitle: string;
  timeframe: string;
  focusSummary: string;
  whyThisOrder: string;
  interviewMilestone: string;
  keyTermIds: string[];
}

export interface ArchitectureComparison {
  id: string;
  title: string;
  subtitle: string;
  stage: RoadmapStageId;
  summary: string;
  items: {
    name: string;
    fullForm: string;
    role: string;
    whenToChoose: string;
    example: string;
  }[];
  interviewTakeaway: string;
}

export interface StudyProgressState {
  masteredIds: string[];
  bookmarkedIds: string[];
  quizHighScore: number;
  quizAttempts: number;
  lastStudiedTermId: string | null;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface FilterOptions {
  searchQuery: string;
  category: TermCategory | 'All';
  roadmapStage: RoadmapStageId | 'All';
  statusFilter: 'all' | 'mastered' | 'unmastered' | 'bookmarked';
  acronymFilter: 'all' | 'acronyms-only' | 'non-acronyms';
}

export interface QuizQuestion {
  id: string;
  termId: string;
  term: string;
  category: TermCategory;
  roadmapStage: RoadmapStageId;
  mode: 'full-form' | 'scenario' | 'interview';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  realWorldTip: string;
}
