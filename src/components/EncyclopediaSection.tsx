import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Table,
  LayoutGrid,
} from 'lucide-react';
import {
  TermEntry,
  FilterOptions,
  RoadmapStageId,
  TermCategory,
} from '../types/atlas.ts';
import { ALL_CATEGORIES } from '../data/roadmapData.ts';
import { QUICK_ACRONYM_INDEX, QuickAcronymRow } from '../data/termsData.ts';
import { filterQuickIndex } from '../utils/studyLogic.ts';

interface EncyclopediaSectionProps {
  terms: TermEntry[];
  allTerms: TermEntry[];
  filters: FilterOptions;
  masteredIds: string[];
  bookmarkedIds: string[];
  onUpdateFilters: (partial: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  onToggleMastered: (termId: string) => void;
  onToggleBookmark: (termId: string) => void;
  onInspectTerm: (term: TermEntry) => void;
}

export const EncyclopediaSection: React.FC<EncyclopediaSectionProps> = ({
  terms,
  allTerms,
  filters,
  masteredIds,
  bookmarkedIds,
  onUpdateFilters,
  onResetFilters,
  onToggleMastered,
  onToggleBookmark,
  onInspectTerm,
}) => {
  const [viewMode, setViewMode] = useState<'deep-dive' | 'quick-table'>('deep-dive');
  const [expandedQAIds, setExpandedQAIds] = useState<Record<string, boolean>>({});

  const masteredSet = new Set(masteredIds);
  const bookmarkedSet = new Set(bookmarkedIds);

  const toggleQASection = (key: string) => {
    setExpandedQAIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredQuickRows: QuickAcronymRow[] = filterQuickIndex(
    QUICK_ACRONYM_INDEX,
    filters.searchQuery,
    filters.category,
    filters.roadmapStage
  );

  const handleQuickRowClick = (deepDiveId: string) => {
    const found = allTerms.find((t) => t.id === deepDiveId);
    if (found) {
      onInspectTerm(found);
    }
  };

  const stages: (RoadmapStageId | 'All')[] = ['All', 1, 2, 3, 4, 5];

  return (
    <section id="encyclopedia" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
            <span>Deep-Dive Encyclopedia & Interview Guide</span>
            <span aria-hidden="true">·</span>
            <span>12 Categories</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Line Definitions + Real Examples</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            02. Full-Forms, Real-World Usage & Interview Q&A
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every entry includes a thorough explanation (never just a single line), where and why it is used in production Python/Django/FastAPI systems, concrete code or architecture examples, and real follow-up questions interviewers ask.
          </p>
        </div>

        {/* View Switcher (Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start lg:self-auto max-w-full">
          <button
            type="button"
            onClick={() => setViewMode('deep-dive')}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'deep-dive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Study Cards ({terms.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('quick-table')}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'quick-table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Quick Table ({filteredQuickRows.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Console */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <label htmlFor="term-search-input" className="sr-only">
              Search terms, full forms, definitions, or interview questions
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="term-search-input"
              type="search"
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
              placeholder="Search e.g. API, DRF, WSGI, ACID, N+1, JWT, Idempotency..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-colors"
            />
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <label htmlFor="category-filter-select" className="sr-only">
              Filter by category
            </label>
            <select
              id="category-filter-select"
              value={filters.category}
              onChange={(e) =>
                onUpdateFilters({
                  category: e.target.value as TermCategory | 'All',
                })
              }
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-colors"
            >
              <option value="All">All 12 Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Select */}
          <div className="md:col-span-3">
            <label htmlFor="status-filter-select" className="sr-only">
              Filter by study status
            </label>
            <select
              id="status-filter-select"
              value={filters.statusFilter}
              onChange={(e) =>
                onUpdateFilters({
                  statusFilter: e.target.value as FilterOptions['statusFilter'],
                })
              }
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-colors"
            >
              <option value="all">Status: All Modules</option>
              <option value="unmastered">To Study (Unmastered)</option>
              <option value="mastered">Mastered Only</option>
              <option value="bookmarked">Bookmarked for Revision</option>
            </select>
          </div>
        </div>

        {/* Stage & Acronym Segmented Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Roadmap Stage Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1">
              Roadmap Stage:
            </span>
            {stages.map((st) => {
              const active = filters.roadmapStage === st;
              return (
                <button
                  key={String(st)}
                  type="button"
                  onClick={() => onUpdateFilters({ roadmapStage: st })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st === 'All' ? 'All Stages' : `Stage 0${st}`}
                </button>
              );
            })}
          </div>

          {/* Acronym vs Technical Term + Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
              {(
                [
                  { id: 'all', label: 'All Terms' },
                  { id: 'acronyms-only', label: 'Acronyms Only' },
                  { id: 'non-acronyms', label: 'Non-Acronyms' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onUpdateFilters({ acronymFilter: tab.id })}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filters.acronymFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(filters.searchQuery !== '' ||
              filters.category !== 'All' ||
              filters.roadmapStage !== 'All' ||
              filters.statusFilter !== 'all' ||
              filters.acronymFilter !== 'all') && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode 1: Deep-Dive Study Cards */}
      {viewMode === 'deep-dive' ? (
        terms.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
            <p className="text-base font-semibold text-slate-900">
              No developer terms match your current filters.
            </p>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Try clearing your search query or switching back to "All Stages" and "All Categories".
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Study Modules</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {terms.map((entry) => {
              const isMastered = masteredSet.has(entry.id);
              const isBookmarked = bookmarkedSet.has(entry.id);
              const isQAExpanded = expandedQAIds[entry.id] ?? true;

              return (
                <article
                  key={entry.id}
                  className={`min-w-0 bg-white border rounded-xl p-5 sm:p-7 transition-colors ${
                    isMastered ? 'border-emerald-300' : 'border-slate-200'
                  }`}
                >
                  {/* Top Row: Quiet inline metadata + Interactive Action Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-sky-700">
                        Stage 0{entry.roadmapStage}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">
                        {entry.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {entry.isAcronym ? 'Standard Acronym' : 'Technical Term (Not an Acronym)'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{entry.priority} Priority</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(entry.id)}
                        aria-label={
                          isBookmarked
                            ? `Remove ${entry.term} from bookmarks`
                            : `Bookmark ${entry.term} for revision`
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleMastered(entry.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {isMastered ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                        <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Full Form Header */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
                        {entry.term}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onInspectTerm(entry)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Open Focused Study Sheet</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-slate-800">
                      Full Form: <span className="text-sky-800">{entry.fullForm}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      {entry.shortSummary}
                    </p>
                  </div>

                  {/* Three-Column or Stacked Deep-Dive Explanation */}
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 pt-5 border-t border-slate-100">
                    {/* 1. In-Depth Definition */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        1. What It Actually Means (Deep Definition)
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {entry.detailedDefinition}
                      </p>
                    </div>

                    {/* 2. Where & Why Used */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        2. Where & Why You Use It in Production
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {entry.whereAndWhyUsed}
                      </p>
                    </div>

                    {/* 3. Real-World Python/Backend Application Example */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        3. Real-World Python / Backend Example
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {entry.realWorldExample}
                      </p>
                    </div>
                  </div>

                  {/* Code / Architecture Snippet (if available) */}
                  {entry.codeSnippet && (
                    <div className="mt-5 bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs font-mono leading-relaxed">
                        <code>{entry.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Interview Questions & Model Answers */}
                  <div className="mt-6 pt-5 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleQASection(entry.id)}
                        aria-expanded={isQAExpanded}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-sky-700 transition-colors cursor-pointer"
                      >
                        <span>
                          Interviewer Q&A Prep ({entry.interviewQuestions.length} Questions for {entry.term})
                        </span>
                        {isQAExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {isQAExpanded && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {entry.interviewQuestions.map((qa, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2"
                          >
                            <div className="text-xs font-mono font-semibold text-sky-700">
                              Q{idx + 1} · {qa.questionType}
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              "{qa.question}"
                            </h5>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60">
                              <strong className="text-slate-900">Model Answer: </strong>
                              {qa.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )
      ) : (
        /* View Mode 2: Quick Cheat-Sheet Master Table */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Complete Quick-Reference Acronym & Term Table ({filteredQuickRows.length} entries)
              </h3>
              <p className="text-xs text-slate-600">
                Click any row to open its full multi-paragraph Deep-Dive Study Sheet, Python example, and Interview Q&A.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4">Full Form</th>
                  <th className="py-3 px-4">Core Meaning</th>
                  <th className="py-3 px-4">Category & Stage</th>
                  <th className="py-3 px-4 text-right">Deep Dive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {filteredQuickRows.map((row, idx) => (
                  <tr
                    key={`${row.abbr}-${idx}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.abbr}
                    </td>
                    <td className="py-3 px-4 font-medium text-sky-900">
                      {row.fullForm}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {row.meaning}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      Stage 0{row.stage} · {row.category}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleQuickRowClick(row.deepDiveId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                      >
                        <span>Inspect Q&A</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
