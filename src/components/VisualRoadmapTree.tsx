import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Search,
  Sparkles,
  Layers,
  Code2,
  HelpCircle,
  Filter,
} from 'lucide-react';
import type { TermEntry, RoadmapStageId } from '../types/atlas.ts';
import {
  VISUAL_ROADMAP_ROWS,
  type VisualRoadmapGroup,
  type VisualRoadmapNode,
} from '../data/visualRoadmapData.ts';
import { calculateVisualRoadmapProgress } from '../utils/studyLogic.ts';

interface VisualRoadmapTreeProps {
  terms: TermEntry[];
  masteredIds: string[];
  onInspectTerm: (term: TermEntry) => void;
  onToggleMastered: (termId: string) => void;
  onSelectStageFilter: (stage: RoadmapStageId) => void;
  onSwitchToChecklistView: () => void;
}

interface StageTheme {
  badgeBg: string;
  badgeText: string;
  spineBorder: string;
  spineAccentBar: string;
  connectorSolid: string;
  connectorDashed: string;
  dotColor: string;
  groupHeaderBg: string;
  groupHeaderDot: string;
}

const STAGE_THEMES: Record<RoadmapStageId, StageTheme> = {
  1: {
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-800',
    spineBorder: 'border-sky-300 hover:border-sky-500',
    spineAccentBar: 'bg-sky-600',
    connectorSolid: 'border-sky-500',
    connectorDashed: 'border-sky-400',
    dotColor: 'bg-sky-600',
    groupHeaderBg: 'bg-sky-50/70 border-sky-100',
    groupHeaderDot: 'bg-sky-500',
  },
  2: {
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-800',
    spineBorder: 'border-indigo-300 hover:border-indigo-500',
    spineAccentBar: 'bg-indigo-600',
    connectorSolid: 'border-indigo-500',
    connectorDashed: 'border-indigo-400',
    dotColor: 'bg-indigo-600',
    groupHeaderBg: 'bg-indigo-50/70 border-indigo-100',
    groupHeaderDot: 'bg-indigo-500',
  },
  3: {
    badgeBg: 'bg-teal-50 border-teal-200',
    badgeText: 'text-teal-800',
    spineBorder: 'border-teal-300 hover:border-teal-500',
    spineAccentBar: 'bg-teal-600',
    connectorSolid: 'border-teal-500',
    connectorDashed: 'border-teal-400',
    dotColor: 'bg-teal-600',
    groupHeaderBg: 'bg-teal-50/70 border-teal-100',
    groupHeaderDot: 'bg-teal-500',
  },
  4: {
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-900',
    spineBorder: 'border-amber-300 hover:border-amber-500',
    spineAccentBar: 'bg-amber-600',
    connectorSolid: 'border-amber-500',
    connectorDashed: 'border-amber-400',
    dotColor: 'bg-amber-600',
    groupHeaderBg: 'bg-amber-50/70 border-amber-100',
    groupHeaderDot: 'bg-amber-500',
  },
  5: {
    badgeBg: 'bg-rose-50 border-rose-200',
    badgeText: 'text-rose-800',
    spineBorder: 'border-rose-300 hover:border-rose-500',
    spineAccentBar: 'bg-rose-600',
    connectorSolid: 'border-rose-500',
    connectorDashed: 'border-rose-400',
    dotColor: 'bg-rose-600',
    groupHeaderBg: 'bg-rose-50/70 border-rose-100',
    groupHeaderDot: 'bg-rose-500',
  },
};

export const VisualRoadmapTree: React.FC<VisualRoadmapTreeProps> = ({
  terms,
  masteredIds,
  onInspectTerm,
  onToggleMastered,
  onSelectStageFilter,
}) => {
  const [activeStageFilter, setActiveStageFilter] = useState<RoadmapStageId | 'ALL'>('ALL');
  const [treeSearchQuery, setTreeSearchQuery] = useState('');
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);

  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);
  const termsById = useMemo(() => {
    const map = new Map<string, TermEntry>();
    for (const t of terms) map.set(t.id, t);
    return map;
  }, [terms]);

  const allNodeTermIds = useMemo(() => {
    const ids: string[] = [];
    for (const row of VISUAL_ROADMAP_ROWS) {
      for (const n of row.leftBranch?.nodes ?? []) ids.push(n.termId);
      for (const n of row.rightBranch?.nodes ?? []) ids.push(n.termId);
    }
    return ids;
  }, []);

  const treeProgress = useMemo(
    () => calculateVisualRoadmapProgress(allNodeTermIds, masteredIds),
    [allNodeTermIds, masteredIds]
  );

  const normalizedQuery = treeSearchQuery.trim().toLowerCase();

  const matchesNode = (node: VisualRoadmapNode): boolean => {
    if (onlyUnmastered && masteredSet.has(node.termId)) {
      return false;
    }
    if (!normalizedQuery) return true;
    const linkedTerm = termsById.get(node.termId);
    return (
      node.label.toLowerCase().includes(normalizedQuery) ||
      node.subLabel.toLowerCase().includes(normalizedQuery) ||
      (linkedTerm?.term.toLowerCase().includes(normalizedQuery) ?? false) ||
      (linkedTerm?.fullForm.toLowerCase().includes(normalizedQuery) ?? false)
    );
  };

  const visibleRows = useMemo(() => {
    return VISUAL_ROADMAP_ROWS.filter((row) => {
      if (activeStageFilter !== 'ALL' && row.stage !== activeStageFilter) {
        return false;
      }
      if (!normalizedQuery && !onlyUnmastered) return true;

      const leftMatches = (row.leftBranch?.nodes ?? []).some(matchesNode);
      const rightMatches = (row.rightBranch?.nodes ?? []).some(matchesNode);
      const spineMatches =
        row.spineTitle.toLowerCase().includes(normalizedQuery) &&
        (!onlyUnmastered || !masteredSet.has(row.spineTermId));

      return leftMatches || rightMatches || spineMatches;
    });
  }, [activeStageFilter, normalizedQuery, onlyUnmastered, masteredSet]);

  const handleNodeClick = (termId: string) => {
    const found = termsById.get(termId);
    if (found) {
      onInspectTerm(found);
    }
  };

  const renderNodeCard = (node: VisualRoadmapNode, stage: RoadmapStageId) => {
    const isMastered = masteredSet.has(node.termId);
    const isFeatured = node.variant === 'indigo';
    const linkedTerm = termsById.get(node.termId);
    const isDimmed =
      (normalizedQuery.length > 0 || onlyUnmastered) && !matchesNode(node);

    const cardSurfaceClasses = isMastered
      ? 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-300/90 text-slate-900'
      : isFeatured
      ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
      : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 text-slate-900';

    return (
      <div
        key={node.id}
        className={`group relative rounded-lg border transition-all duration-150 ${cardSurfaceClasses} ${
          isDimmed ? 'opacity-35' : 'shadow-2xs hover:shadow-xs'
        }`}
      >
        <button
          type="button"
          onClick={() => handleNodeClick(node.termId)}
          className="w-full text-left p-3 pr-9 cursor-pointer"
        >
          {/* Top Metadata Row: Concise Code Tag + Question Count */}
          <div className="flex items-center justify-between gap-1.5 mb-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {linkedTerm && (
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[115px] ${
                    isMastered
                      ? 'bg-emerald-100 text-emerald-900'
                      : isFeatured
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {linkedTerm.term.split(/[,/(&]/)[0].trim()}
                </span>
              )}
              {isFeatured && !isMastered && (
                <span className="text-[10px] font-semibold text-amber-300 inline-flex items-center gap-0.5 whitespace-nowrap shrink-0">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Focus</span>
                </span>
              )}
            </div>
            {linkedTerm && (
              <span
                className={`text-[10px] font-mono whitespace-nowrap shrink-0 ${
                  isFeatured && !isMastered ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {linkedTerm.interviewQuestions.length} Q&A
              </span>
            )}
          </div>

          {/* Main Node Title */}
          <div
            className={`text-xs sm:text-[13px] font-bold leading-snug ${
              isFeatured && !isMastered ? 'text-white' : 'text-slate-900'
            }`}
          >
            {node.label}
          </div>

          {/* Full Form / Architectural Sub-Label */}
          <div
            className={`text-[11px] leading-tight mt-0.5 truncate ${
              isFeatured && !isMastered
                ? 'text-slate-300'
                : isMastered
                ? 'text-emerald-900/80'
                : 'text-slate-500'
            }`}
          >
            {node.subLabel}
          </div>
        </button>

        {/* Corner Mastery Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMastered(node.termId);
          }}
          aria-label={
            isMastered
              ? `Unmark ${node.label} as mastered`
              : `Mark ${node.label} as mastered`
          }
          title={
            isMastered
              ? 'Mastered! Click to unmark'
              : 'Click to mark as Mastered'
          }
          className={`absolute right-2 top-2.5 w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            isMastered
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : isFeatured
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
          }`}
        >
          {isMastered ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Circle className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  };

  const renderBranchGroup = (
    group: VisualRoadmapGroup | undefined,
    side: 'left' | 'right',
    stage: RoadmapStageId
  ) => {
    if (!group) {
      return <div className="hidden lg:block" />;
    }

    const theme = STAGE_THEMES[stage];
    const gridCols =
      group.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';

    const groupMasteredCount = group.nodes.filter((n) =>
      masteredSet.has(n.termId)
    ).length;

    return (
      <div className="flex flex-col gap-3">
        {group.groupTitle ? (
          <div className="bg-white/95 border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
            {/* Architectural Cluster Header */}
            <div
              className={`px-3.5 py-2 border-b flex items-center justify-between gap-2 ${theme.groupHeaderBg}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${theme.groupHeaderDot}`}
                />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {group.groupTitle}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
                {groupMasteredCount}/{group.nodes.length}
              </span>
            </div>

            {/* Sub-Nodes Grid */}
            <div className={`p-3 grid ${gridCols} gap-2.5`}>
              {group.nodes.map((node) => renderNodeCard(node, stage))}
            </div>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-2.5`}>
            {group.nodes.map((node) => renderNodeCard(node, stage))}
          </div>
        )}

        {group.calloutNote && (
          <div
            className={`bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2.5 border border-slate-800 ${
              side === 'left' ? 'lg:mr-1' : 'lg:ml-1'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-sky-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>INTERVIEW CHECKPOINT</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {group.calloutNote.text}
            </p>
            <a
              href={`#${group.calloutNote.targetSectionId}`}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>{group.calloutNote.actionLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      data-testid="visual-roadmap-tree"
      className="bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] border border-slate-200 rounded-2xl p-4 sm:p-8 space-y-6 shadow-xs"
    >
      {/* Top Blueprint Control Deck */}
      <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Stage Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: 'Full Blueprint (11)' },
                { id: 1, label: '01. Web & APIs' },
                { id: 2, label: '02. Auth & Security' },
                { id: 3, label: '03. SQL & NoSQL' },
                { id: 4, label: '04. Servers & CI/CD' },
                { id: 5, label: '05. Scale & Design' },
              ] as const
            ).map((tab) => {
              const isActive = activeStageFilter === tab.id;
              return (
                <button
                  key={String(tab.id)}
                  type="button"
                  onClick={() => setActiveStageFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Unmastered Filter inside the Tree */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={treeSearchQuery}
                onChange={(e) => setTreeSearchQuery(e.target.value)}
                aria-label="Filter nodes in visual roadmap"
                placeholder="Highlight node (e.g. DRF, GIL)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-600"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyUnmastered((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                onlyUnmastered
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{onlyUnmastered ? 'Showing Unmastered' : 'Unmastered Only'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Status Bar inside Control Deck */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              Tree Progress: {treeProgress.masteredNodes}/{treeProgress.totalNodes} Concepts Mastered ({treeProgress.percentage}%)
            </span>
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Stage 01
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Stage 02
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Stage 03
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Stage 04
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Stage 05
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>Click any card for Code & Interview Q&A</span>
            </span>
          </div>
        </div>
      </div>

      {/* Blueprint Root Node ("Python Backend Architecture") */}
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-bold tracking-tight shadow-xs">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Python Backend Engineering Spine</span>
        </div>
        <div className="h-6 w-[2px] bg-gradient-to-b from-slate-900 to-sky-500" />
      </div>

      {/* Main Vertical Blueprint Spine & Branching Clusters */}
      <div className="relative space-y-8 sm:space-y-10">
        {/* Continuous Central Architectural Spine Line (Desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-gradient-to-b from-sky-500 via-teal-500 to-rose-500 z-0"
        />

        {visibleRows.map((row, index) => {
          const theme = STAGE_THEMES[row.stage];
          const isSpineMastered = masteredSet.has(row.spineTermId);

          const rowNodes = [
            ...(row.leftBranch?.nodes ?? []),
            ...(row.rightBranch?.nodes ?? []),
          ];
          const rowMasteredCount = rowNodes.filter((n) =>
            masteredSet.has(n.termId)
          ).length;
          const rowPercent =
            rowNodes.length > 0
              ? Math.round((rowMasteredCount / rowNodes.length) * 100)
              : 0;

          const leftConnectorClass =
            row.leftBranch?.connectorStyle === 'solid'
              ? `border-t-2 ${theme.connectorSolid}`
              : `border-t-2 border-dashed ${theme.connectorDashed}`;
          const rightConnectorClass =
            row.rightBranch?.connectorStyle === 'solid'
              ? `border-t-2 ${theme.connectorSolid}`
              : `border-t-2 border-dashed ${theme.connectorDashed}`;

          return (
            <React.Fragment key={row.id}>
              {row.sectionDividerLabel && (
                <div className="relative z-10 flex justify-center py-2">
                  <div className="bg-slate-900 text-white px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-full border border-slate-700 shadow-xs">
                    {row.sectionDividerLabel}
                  </div>
                </div>
              )}

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_284px_minmax(0,1fr)] gap-4 lg:gap-0 items-center">
                {/* Left Branch Cluster */}
                <div className="min-w-0 order-2 lg:order-1">
                  {renderBranchGroup(row.leftBranch, 'left', row.stage)}
                </div>

                {/* Center Spine Milestone Hub + Left/Right Blueprint Connectors */}
                <div className="order-1 lg:order-2 flex items-center justify-center">
                  {/* Left Connector Line + Junction Dot on Desktop */}
                  <div className="hidden lg:flex items-center flex-1 min-w-[28px]">
                    {row.leftBranch ? (
                      <>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${theme.dotColor}`}
                        />
                        <div className={`flex-1 ${leftConnectorClass}`} />
                      </>
                    ) : (
                      <div className="flex-1 border-transparent" />
                    )}
                  </div>

                  {/* Central Milestone Hub Card */}
                  <div
                    className={`relative w-full max-w-[250px] lg:w-[204px] shrink-0 bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all ${
                      isSpineMastered
                        ? 'border-emerald-500'
                        : theme.spineBorder
                    }`}
                  >
                    {/* Top Stage Color Accent Bar */}
                    <div
                      className={`h-1.5 w-full ${
                        isSpineMastered ? 'bg-emerald-500' : theme.spineAccentBar
                      }`}
                    />

                    <div className="p-3 text-center space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${theme.badgeBg} ${theme.badgeText}`}
                        >
                          STEP {String(index + 1).padStart(2, '0')} · S0{row.stage}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMastered(row.spineTermId);
                          }}
                          aria-label={`Toggle mastered for ${row.spineTitle}`}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                            isSpineMastered
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                          }`}
                        >
                          {isSpineMastered ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNodeClick(row.spineTermId)}
                        className="w-full text-center cursor-pointer group"
                      >
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 leading-snug transition-colors">
                          {row.spineTitle}
                        </div>
                        {row.spineSubtitle && (
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            {row.spineSubtitle}
                          </div>
                        )}
                      </button>

                      {/* Mini Cluster Completion Progress Bar inside Hub */}
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Branch Mastery</span>
                          <span className="font-bold text-slate-700">
                            {rowMasteredCount}/{rowNodes.length}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-200 ${
                              rowPercent === 100
                                ? 'bg-emerald-500'
                                : theme.spineAccentBar
                            }`}
                            style={{ width: `${rowPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Connector Line + Junction Dot on Desktop */}
                  <div className="hidden lg:flex items-center flex-1 min-w-[28px]">
                    {row.rightBranch ? (
                      <>
                        <div className={`flex-1 ${rightConnectorClass}`} />
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${theme.dotColor}`}
                        />
                      </>
                    ) : (
                      <div className="flex-1 border-transparent" />
                    )}
                  </div>
                </div>

                {/* Right Branch Cluster */}
                <div className="min-w-0 order-3">
                  {renderBranchGroup(row.rightBranch, 'right', row.stage)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Spine Footer: Deep-Dive Stage Tracks */}
      <div className="flex flex-col items-center pt-2">
        <div className="h-6 w-[2px] bg-rose-500" />
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-4 sm:p-5 text-center space-y-3 shadow-xs">
          <div className="text-xs sm:text-sm font-bold text-slate-900">
            Jump Directly to Filtered Deep-Dive Encyclopedia Tracks:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectStageFilter(1)}
              className="py-2.5 px-3 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            >
              Stage 01: Core APIs & DRF
            </button>
            <button
              type="button"
              onClick={() => onSelectStageFilter(4)}
              className="py-2.5 px-3 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            >
              Stage 04: DevOps & ASGI
            </button>
            <button
              type="button"
              onClick={() => onSelectStageFilter(5)}
              className="py-2.5 px-3 text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              Stage 05: System Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
