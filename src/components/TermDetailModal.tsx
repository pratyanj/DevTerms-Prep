import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Bookmark,
  ArrowRight,
} from 'lucide-react';
import { TermEntry } from '../types/atlas.ts';

interface TermDetailModalProps {
  term: TermEntry | null;
  allTerms: TermEntry[];
  isMastered: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleMastered: (termId: string) => void;
  onToggleBookmark: (termId: string) => void;
  onSelectRelatedTerm: (term: TermEntry) => void;
}

export const TermDetailModal: React.FC<TermDetailModalProps> = ({
  term,
  allTerms,
  isMastered,
  isBookmarked,
  onClose,
  onToggleMastered,
  onToggleBookmark,
  onSelectRelatedTerm,
}) => {
  useEffect(() => {
    if (!term) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [term, onClose]);

  if (!term) return null;

  const relatedEntries = term.relatedTerms
    .map((id) => allTerms.find((t) => t.id === id))
    .filter((t): t is TermEntry => Boolean(t));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-term-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl p-5 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Metadata & Close Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-sky-700">
                Roadmap Stage 0{term.roadmapStage}
              </span>
              <span aria-hidden="true">·</span>
              <span>{term.category}</span>
              <span aria-hidden="true">·</span>
              <span>
                {term.isAcronym ? 'Standard Acronym' : 'Technical Term (Not an Acronym)'}
              </span>
            </div>
            <h2
              id="modal-term-heading"
              className="text-2xl sm:text-3xl font-bold font-mono text-slate-900"
            >
              {term.term}
            </h2>
            <p className="text-base sm:text-lg font-semibold text-sky-800">
              {term.fullForm}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close study sheet"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
          <p className="text-xs sm:text-sm font-medium text-slate-700 flex-1">
            {term.shortSummary}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleBookmark(term.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleMastered(term.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isMastered
                  ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
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

        {/* Detailed Multi-Paragraph Sections */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              1. In-Depth Technical Definition
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {term.detailedDefinition}
            </p>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              2. Where & Why It Is Used in Software Engineering
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {term.whereAndWhyUsed}
            </p>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              3. Real-World Python / Backend Application Example
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {term.realWorldExample}
            </p>
          </div>

          {term.codeSnippet && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                <code>{term.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Interview Questions & Answers */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              4. Interviewer Questions & Model Responses
            </h3>
            <div className="space-y-3">
              {term.interviewQuestions.map((qa, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="text-xs font-mono font-semibold text-sky-700">
                    Question {idx + 1} · {qa.questionType}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    "{qa.question}"
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60">
                    <strong className="text-slate-900">Strong Answer: </strong>
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Modules */}
          {relatedEntries.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-700">
                Connected Concepts to Study Next:
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedEntries.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectRelatedTerm(rel)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{rel.term}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
