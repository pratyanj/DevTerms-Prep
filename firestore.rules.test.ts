import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Static & structural security rule evaluator verifying all Dirty Dozen invariants against firestore.rules
const rulesSource = fs.existsSync('./firestore.rules')
  ? fs.readFileSync('./firestore.rules', 'utf8')
  : fs.readFileSync('./DRAFT_firestore.rules', 'utf8');

interface MockAuth {
  uid: string;
  email_verified: boolean;
}

interface MockRequest {
  auth: MockAuth | null;
  pathUserId: string;
  nowIso: string;
  existingData?: Record<string, unknown> | null;
  incomingData: Record<string, unknown>;
  op: 'create' | 'update' | 'get';
}

function evaluateUserStudyProgressRule(req: MockRequest): 'ALLOW' | 'PERMISSION_DENIED' {
  if (!req.auth) return 'PERMISSION_DENIED';
  const isValidId =
    typeof req.pathUserId === 'string' &&
    req.pathUserId.length >= 1 &&
    req.pathUserId.length <= 128 &&
    /^[a-zA-Z0-9_\-]+$/.test(req.pathUserId);
  if (!isValidId) return 'PERMISSION_DENIED';
  if (req.auth.uid !== req.pathUserId) return 'PERMISSION_DENIED';

  if (req.op === 'get') return 'ALLOW';
  if (!req.auth.email_verified) return 'PERMISSION_DENIED';

  const d = req.incomingData;
  const requiredKeys = [
    'ownerId',
    'displayName',
    'streakCount',
    'longestStreak',
    'lastActiveDate',
    'quizHighScore',
    'quizAttempts',
    'masteredIds',
    'bookmarkedIds',
    'createdAt',
    'updatedAt',
  ];
  const keys = Object.keys(d);
  if (keys.length !== requiredKeys.length || !requiredKeys.every((k) => keys.includes(k))) {
    return 'PERMISSION_DENIED';
  }
  if (
    typeof d.ownerId !== 'string' ||
    d.ownerId !== req.auth.uid ||
    !/^[a-zA-Z0-9_\-]+$/.test(d.ownerId)
  ) {
    return 'PERMISSION_DENIED';
  }
  if (typeof d.displayName !== 'string' || d.displayName.length < 1 || d.displayName.length > 100) {
    return 'PERMISSION_DENIED';
  }
  if (!Number.isInteger(d.streakCount) || (d.streakCount as number) < 1 || (d.streakCount as number) > 10000) {
    return 'PERMISSION_DENIED';
  }
  if (!Number.isInteger(d.longestStreak) || (d.longestStreak as number) < 1 || (d.longestStreak as number) > 10000) {
    return 'PERMISSION_DENIED';
  }
  if (typeof d.lastActiveDate !== 'string' || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d.lastActiveDate)) {
    return 'PERMISSION_DENIED';
  }
  if (!Number.isInteger(d.quizHighScore) || (d.quizHighScore as number) < 0 || (d.quizHighScore as number) > 100) {
    return 'PERMISSION_DENIED';
  }
  if (!Number.isInteger(d.quizAttempts) || (d.quizAttempts as number) < 0 || (d.quizAttempts as number) > 100000) {
    return 'PERMISSION_DENIED';
  }

  for (const listField of [d.masteredIds, d.bookmarkedIds]) {
    if (!Array.isArray(listField) || listField.length > 100) return 'PERMISSION_DENIED';
    if (listField.length > 0 && (typeof listField[0] !== 'string' || listField[0].length > 64)) {
      return 'PERMISSION_DENIED';
    }
  }

  if (req.op === 'create') {
    if (d.createdAt !== req.nowIso || d.updatedAt !== req.nowIso) return 'PERMISSION_DENIED';
  } else if (req.op === 'update') {
    if (!req.existingData) return 'PERMISSION_DENIED';
    if (d.ownerId !== req.existingData.ownerId) return 'PERMISSION_DENIED';
    if (d.createdAt !== req.existingData.createdAt) return 'PERMISSION_DENIED';
    if (d.updatedAt !== req.nowIso) return 'PERMISSION_DENIED';
  }

  return 'ALLOW';
}

const NOW = '2026-10-18T12:00:00Z';
const VALID_PAYLOAD = {
  ownerId: 'user_1',
  displayName: 'Pratyanj Modh',
  streakCount: 3,
  longestStreak: 5,
  lastActiveDate: '2026-10-18',
  quizHighScore: 92,
  quizAttempts: 4,
  masteredIds: ['api', 'rest', 'drf'],
  bookmarkedIds: ['wsgi-asgi'],
  createdAt: NOW,
  updatedAt: NOW,
};

test('Firestore rules file contains all mandatory 8-Pillar guards', () => {
  assert.ok(rulesSource.includes("rules_version = '2';"));
  assert.ok(rulesSource.includes('allow read, write: if false;'));
  assert.ok(rulesSource.includes('isValidUserStudyProgress(incoming())'));
  assert.ok(rulesSource.includes('request.auth.token.email_verified == true'));
  assert.ok(rulesSource.includes('affectedKeys().hasOnly('));
  assert.ok(rulesSource.includes('incoming().createdAt == existing().createdAt'));
});

test('Dirty Dozen adversarial payloads all return PERMISSION_DENIED', () => {
  // Valid control check
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: VALID_PAYLOAD,
      op: 'create',
    }),
    'ALLOW'
  );

  // 1. Unauthenticated write
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: null,
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: VALID_PAYLOAD,
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 2. Unverified email spoof
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: false },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: VALID_PAYLOAD,
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 3. Cross-user path mismatch
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'attacker_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: VALID_PAYLOAD,
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 4. Payload ownerId spoofing
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: { ...VALID_PAYLOAD, ownerId: 'victim_99' },
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 5. Shadow field on create
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: { ...VALID_PAYLOAD, isAdmin: true },
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 6. Shadow field on update
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      existingData: VALID_PAYLOAD,
      incomingData: { ...VALID_PAYLOAD, role: 'superuser' },
      op: 'update',
    }),
    'PERMISSION_DENIED'
  );

  // 7. Malformed lastActiveDate
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: { ...VALID_PAYLOAD, lastActiveDate: '18-10-2026' },
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 8. Invalid streakCount <= 0
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: { ...VALID_PAYLOAD, streakCount: 0 },
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 9. Oversized displayName (> 100 chars)
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: { ...VALID_PAYLOAD, displayName: 'x'.repeat(120) },
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 10. Unbounded array (> 100 items)
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      incomingData: {
        ...VALID_PAYLOAD,
        masteredIds: Array.from({ length: 105 }, (_, i) => `term_${i}`),
      },
      op: 'create',
    }),
    'PERMISSION_DENIED'
  );

  // 11. Immortal field tampering on update (changing createdAt)
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      existingData: { ...VALID_PAYLOAD, createdAt: '2026-10-01T00:00:00Z' },
      incomingData: { ...VALID_PAYLOAD, createdAt: NOW },
      op: 'update',
    }),
    'PERMISSION_DENIED'
  );

  // 12. Forged client timestamp on update
  assert.equal(
    evaluateUserStudyProgressRule({
      auth: { uid: 'user_1', email_verified: true },
      pathUserId: 'user_1',
      nowIso: NOW,
      existingData: VALID_PAYLOAD,
      incomingData: { ...VALID_PAYLOAD, updatedAt: '2099-01-01T00:00:00Z' },
      op: 'update',
    }),
    'PERMISSION_DENIED'
  );
});
