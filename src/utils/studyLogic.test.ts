import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterTerms,
  filterQuickIndex,
  calculateStageProgress,
  calculateOverallStats,
  toggleIdInList,
  gradeQuizSubmission,
  calculateUpdatedStreak,
  calculateCategoryBreakdown,
  generateStudySchedule,
  calculateVisualRoadmapProgress,
} from './studyLogic.ts';
import { ALL_TERMS, QUICK_ACRONYM_INDEX, QUIZ_QUESTIONS } from '../data/termsData.ts';
import { ROADMAP_STAGES, ALL_CATEGORIES } from '../data/roadmapData.ts';
import { VISUAL_ROADMAP_ROWS } from '../data/visualRoadmapData.ts';

test('dataset integrity: all terms have multi-sentence definitions, real-world examples, and interview questions', () => {
  assert.ok(ALL_TERMS.length >= 25, 'Should have at least 25 deep-dive modules');
  assert.ok(QUICK_ACRONYM_INDEX.length >= 45, 'Should have comprehensive quick acronym index rows');
  assert.equal(ROADMAP_STAGES.length, 5, 'Should have 5 structured roadmap stages');

  for (const entry of ALL_TERMS) {
    assert.ok(entry.term.length > 0, `Term missing name: ${entry.id}`);
    assert.ok(entry.fullForm.length > 0, `Term missing fullForm: ${entry.id}`);
    assert.ok(entry.detailedDefinition.length > 100, `Term ${entry.id} definition must be detailed, not a single short line`);
    assert.ok(entry.whereAndWhyUsed.length > 40, `Term ${entry.id} missing whereAndWhyUsed`);
    assert.ok(entry.realWorldExample.length > 40, `Term ${entry.id} missing realWorldExample`);
    assert.ok(entry.interviewQuestions.length >= 1, `Term ${entry.id} must have interview questions`);
  }
});

test('filterTerms filters by search query, category, roadmapStage, and mastery status', () => {
  const drfResults = filterTerms(
    ALL_TERMS,
    {
      searchQuery: 'Django REST Framework',
      category: 'All',
      roadmapStage: 'All',
      statusFilter: 'all',
      acronymFilter: 'all',
    },
    { masteredIds: [], bookmarkedIds: [] }
  );
  assert.ok(drfResults.some((t) => t.id === 'drf'));

  const stage1Only = filterTerms(
    ALL_TERMS,
    {
      searchQuery: '',
      category: 'All',
      roadmapStage: 1,
      statusFilter: 'all',
      acronymFilter: 'all',
    },
    { masteredIds: [], bookmarkedIds: [] }
  );
  assert.ok(stage1Only.length > 0);
  assert.ok(stage1Only.every((t) => t.roadmapStage === 1));

  const nonAcronyms = filterTerms(
    ALL_TERMS,
    {
      searchQuery: '',
      category: 'All',
      roadmapStage: 'All',
      statusFilter: 'all',
      acronymFilter: 'non-acronyms',
    },
    { masteredIds: [], bookmarkedIds: [] }
  );
  assert.ok(nonAcronyms.some((t) => t.id === 'idempotency'));
  assert.ok(nonAcronyms.every((t) => !t.isAcronym));
});

test('calculateStageProgress and calculateOverallStats compute accurate mastery metrics', () => {
  const stage1Terms = ALL_TERMS.filter((t) => t.roadmapStage === 1);
  const firstTwoIds = stage1Terms.slice(0, 2).map((t) => t.id);

  const stage1Summary = calculateStageProgress(ALL_TERMS, 1, firstTwoIds);
  assert.equal(stage1Summary.mastered, 2);
  assert.equal(stage1Summary.total, stage1Terms.length);
  assert.equal(stage1Summary.isComplete, false);
  assert.equal(stage1Summary.nextRecommendedTerm?.id, stage1Terms[2].id);

  const overall = calculateOverallStats(ALL_TERMS, {
    masteredIds: firstTwoIds,
    bookmarkedIds: ['api', 'jwt'],
  });
  assert.equal(overall.masteredCount, 2);
  assert.equal(overall.bookmarkedCount, 2);
  assert.ok(overall.totalInterviewQuestions >= 30);
});

test('toggleIdInList adds and removes IDs cleanly without mutation', () => {
  const initial = ['api', 'rest'];
  const added = toggleIdInList(initial, 'drf');
  assert.deepEqual(added, ['api', 'rest', 'drf']);
  const removed = toggleIdInList(added, 'api');
  assert.deepEqual(removed, ['rest', 'drf']);
});

test('filterQuickIndex filters quick cheat sheet rows accurately', () => {
  const results = filterQuickIndex(QUICK_ACRONYM_INDEX, 'MVCC', 'All', 'All');
  assert.equal(results.length, 1);
  assert.equal(results[0].abbr, 'MVCC');
});

test('gradeQuizSubmission calculates score and pass threshold accurately', () => {
  const sampleQuestions = QUIZ_QUESTIONS.slice(0, 4);
  const answers: Record<string, number> = {
    [sampleQuestions[0].id]: sampleQuestions[0].correctIndex,
    [sampleQuestions[1].id]: sampleQuestions[1].correctIndex,
    [sampleQuestions[2].id]: sampleQuestions[2].correctIndex,
    [sampleQuestions[3].id]: 2, // wrong
  };

  const result = gradeQuizSubmission(sampleQuestions, answers);
  assert.equal(result.score, 3);
  assert.equal(result.total, 4);
  assert.equal(result.percentage, 75);
  assert.equal(result.passed, true);
});

test('calculateUpdatedStreak tracks consecutive days, same-day interactions, and missed-day resets', () => {
  // 1. First time interaction (null lastActiveDate) -> starts at 1
  const firstDay = calculateUpdatedStreak(0, 0, null, '2026-10-16');
  assert.equal(firstDay.streakCount, 1);
  assert.equal(firstDay.longestStreak, 1);
  assert.equal(firstDay.lastActiveDate, '2026-10-16');
  assert.equal(firstDay.status, 'reset-to-1');

  // 2. Same day interaction -> maintains streak at 1
  const sameDay = calculateUpdatedStreak(
    firstDay.streakCount,
    firstDay.longestStreak,
    firstDay.lastActiveDate,
    '2026-10-16'
  );
  assert.equal(sameDay.streakCount, 1);
  assert.equal(sameDay.status, 'maintained');

  // 3. Next consecutive day -> increments streak to 2
  const dayTwo = calculateUpdatedStreak(
    sameDay.streakCount,
    sameDay.longestStreak,
    sameDay.lastActiveDate,
    '2026-10-17'
  );
  assert.equal(dayTwo.streakCount, 2);
  assert.equal(dayTwo.longestStreak, 2);
  assert.equal(dayTwo.lastActiveDate, '2026-10-17');
  assert.equal(dayTwo.status, 'incremented');

  // 4. Another consecutive day -> increments streak to 3
  const dayThree = calculateUpdatedStreak(
    dayTwo.streakCount,
    dayTwo.longestStreak,
    dayTwo.lastActiveDate,
    '2026-10-18'
  );
  assert.equal(dayThree.streakCount, 3);
  assert.equal(dayThree.longestStreak, 3);
  assert.equal(dayThree.status, 'incremented');

  // 5. Missed day (jumps from Oct 18 to Oct 20) -> resets streakCount to 1, preserves longestStreak = 3
  const missedDay = calculateUpdatedStreak(
    dayThree.streakCount,
    dayThree.longestStreak,
    dayThree.lastActiveDate,
    '2026-10-20'
  );
  assert.equal(missedDay.streakCount, 1);
  assert.equal(missedDay.longestStreak, 3);
  assert.equal(missedDay.lastActiveDate, '2026-10-20');
  assert.equal(missedDay.status, 'reset-to-1');
});

test('calculateCategoryBreakdown and generateStudySchedule compute domain stats and daily targets', () => {
  const breakdown = calculateCategoryBreakdown(ALL_TERMS, ALL_CATEGORIES, ['api', 'drf', 'jwt']);
  assert.equal(breakdown.length, ALL_CATEGORIES.length);
  const backendCat = breakdown.find((c) => c.category === 'Backend & APIs');
  assert.ok(backendCat);
  assert.ok(backendCat.total > 0);
  assert.equal(backendCat.mastered, 1); // 'drf'

  const schedule7Days = generateStudySchedule(ALL_TERMS, ['api', 'json'], 7, 'fastapi-async');
  assert.equal(schedule7Days.daysAvailable, 7);
  assert.equal(schedule7Days.remainingModules, ALL_TERMS.length - 2);
  assert.ok(schedule7Days.modulesPerDay >= 1);
  assert.ok(schedule7Days.recommendedToday.length >= 2);
  assert.deepEqual(schedule7Days.priorityStages, [1, 4, 2, 3, 5]);
});

test('VISUAL_ROADMAP_ROWS links every spine and branch node to a valid termId in ALL_TERMS', () => {
  const validIds = new Set(ALL_TERMS.map((t) => t.id));
  assert.ok(VISUAL_ROADMAP_ROWS.length >= 8, 'Should have comprehensive flowchart rows');

  const allNodeTermIds: string[] = [];
  for (const row of VISUAL_ROADMAP_ROWS) {
    assert.ok(validIds.has(row.spineTermId), `Invalid spineTermId ${row.spineTermId} on row ${row.id}`);
    for (const node of row.leftBranch?.nodes ?? []) {
      assert.ok(validIds.has(node.termId), `Invalid termId ${node.termId} on left node ${node.id}`);
      allNodeTermIds.push(node.termId);
    }
    for (const node of row.rightBranch?.nodes ?? []) {
      assert.ok(validIds.has(node.termId), `Invalid termId ${node.termId} on right node ${node.id}`);
      allNodeTermIds.push(node.termId);
    }
  }

  const progress = calculateVisualRoadmapProgress(allNodeTermIds, ['http', 'api', 'drf']);
  assert.equal(progress.totalNodes, allNodeTermIds.length);
  assert.ok(progress.masteredNodes >= 3);
});
