import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Layers,
  GitBranch,
  Check,
  Network,
  ListChecks,
} from 'lucide-react';
import type {
  RoadmapStage,
  RoadmapStageId,
  TermEntry,
  ArchitectureComparison,
} from '../types/atlas.ts';
import { calculateStageProgress } from '../utils/studyLogic.ts';
import { PRODUCTION_REQUEST_PIPELINE } from '../data/roadmapData.ts';
import { VisualRoadmapTree } from './VisualRoadmapTree.tsx';

interface RoadmapSectionProps {
  stages: RoadmapStage[];
  terms: TermEntry[];
  comparisons: ArchitectureComparison[];
  masteredIds: string[];
  selectedStage: RoadmapStageId | 'All';
  onSelectStageFilter: (stage: RoadmapStageId) => void;
  onInspectTerm: (term: TermEntry) => void;
  onToggleMastered: (termId: string) => void;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  stages,
  terms,
  comparisons,
  masteredIds,
  selectedStage,
  onSelectStageFilter,
  onInspectTerm,
  onToggleMastered,
}) => {
  const [roadmapViewMode, setRoadmapViewMode] = useState<'flowchart' | 'stages'>(
    'flowchart'
  );
  const masteredSet = new Set(masteredIds);

  return (
    <section id="roadmap" className="scroll-mt-24 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
            <span>Interactive Visual Flowchart</span>
            <span aria-hidden="true">·</span>
            <span>5 Progressive Stages</span>
            <span aria-hidden="true">·</span>
            <span>Python Backend Focus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            01. What to Remember First — Backend Engineering Blueprint
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Follow the stage-coded engineering spine from top to bottom and explore the left/right architectural clusters. Click any concept card to inspect its full form, production Python/Django/FastAPI code, and interview Q&As, or toggle its corner check icon as you master each topic.
          </p>
        </div>

        {/* View Mode Switcher: Visual Flowchart vs 5-Stage Cards */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start lg:self-auto max-w-full">
          <button
            type="button"
            onClick={() => setRoadmapViewMode('flowchart')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              roadmapViewMode === 'flowchart'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Visual Flowchart</span>
          </button>
          <button
            type="button"
            onClick={() => setRoadmapViewMode('stages')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              roadmapViewMode === 'stages'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>5-Stage Checklist</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Interactive Visual Flowchart Tree (roadmap.sh style) */}
      {roadmapViewMode === 'flowchart' ? (
        <VisualRoadmapTree
          terms={terms}
          masteredIds={masteredIds}
          onInspectTerm={onInspectTerm}
          onToggleMastered={onToggleMastered}
          onSelectStageFilter={onSelectStageFilter}
          onSwitchToChecklistView={() => setRoadmapViewMode('stages')}
        />
      ) : (
        /* View Mode 2: 5-Stage Progression Grid */
        <div className="space-y-6">
          {stages.map((stage) => {
          const progress = calculateStageProgress(terms, stage.id, masteredIds);
          const stageTerms = terms.filter((t) => t.roadmapStage === stage.id);
          const isSelected = selectedStage === stage.id;

          return (
            <article
              key={stage.id}
              className={`bg-white border rounded-xl p-5 sm:p-7 transition-colors ${
                isSelected
                  ? 'border-sky-600 ring-1 ring-sky-600'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Column: Stage Rationale & Interview Milestone */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold text-sky-700">
                      {stage.timeframe}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {progress.mastered} of {progress.total} modules mastered ({progress.percentage}%)
                    </span>
                    {progress.isComplete && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Stage Complete
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {stage.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-700">
                    {stage.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {stage.focusSummary}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 mt-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 mb-1">
                        Why Learn This Stage Here:
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {stage.whyThisOrder}
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 mb-1">
                        Target Interview Milestone:
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {stage.interviewMilestone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Progress & Action */}
                <div className="lg:w-72 shrink-0 flex flex-col justify-between gap-4 bg-slate-50 border border-slate-200/80 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">Stage Mastery</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {progress.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 transition-all duration-200"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectStageFilter(stage.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Study Stage {stage.id} in Encyclopedia</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Term Checklist Row */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-3">
                  Stage {stage.id} Core Modules (Click term for Deep-Dive Q&A, or toggle checkmark):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {stageTerms.map((term) => {
                    const isMastered = masteredSet.has(term.id);
                    return (
                      <div
                        key={term.id}
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border text-left transition-colors ${
                          isMastered
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                            : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 text-slate-900'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onInspectTerm(term)}
                          className="flex-1 text-left min-w-0 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                              {term.term}
                            </span>
                            <span className="text-slate-300" aria-hidden="true">·</span>
                            <span className="text-xs text-slate-500 truncate">
                              {term.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 truncate mt-0.5">
                            {term.fullForm}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleMastered(term.id)}
                          aria-label={
                            isMastered
                              ? `Unmark ${term.term} as mastered`
                              : `Mark ${term.term} as mastered`
                          }
                          className={`p-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                            isMastered
                              ? 'text-emerald-700 hover:bg-emerald-100'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                          }`}
                        >
                          {isMastered ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
        </div>
      )}

      {/* Production Request Pipeline Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
            <GitBranch className="w-3.5 h-3.5" />
            <span>End-to-End Request Architecture</span>
            <span aria-hidden="true">·</span>
            <span>How Acronyms Connect in Production</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            How a Python Backend Request Flows in Production
          </h3>
          <p className="text-sm text-slate-600">
            When an interviewer asks <span className="font-medium text-slate-900">"What happens when a user clicks Checkout in your app?"</span>, trace this 6-step architecture flow connecting your acronyms together:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTION_REQUEST_PIPELINE.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-bold text-sky-700 tabular-nums">
                    Step {item.step}
                  </span>
                  <span className="font-mono text-xs text-slate-600">
                    {item.acronyms}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.node}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Interview Distinctions */}
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
            <Layers className="w-3.5 h-3.5" />
            <span>High-Frequency Interview Comparisons</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Critical Side-by-Side Distinctions Interviewers Test
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {comparisons.map((comp) => (
            <div
              key={comp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono text-sky-700 font-semibold">
                    Stage 0{comp.stage}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{comp.subtitle}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {comp.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {comp.summary}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                {comp.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.fullForm}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.role}
                    </p>
                    <div className="text-xs text-slate-500 pt-1">
                      <strong className="text-slate-700">Example:</strong> {item.example}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Interview Golden Rule: </span>
                {comp.interviewTakeaway}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
