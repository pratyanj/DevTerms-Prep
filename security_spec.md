# Security Specification — PyBackend Atlas Per-User Study Streak & Progress

## 1. Data Invariants
1. **Path & Ownership Identity**: A document at `/userStudyProgress/{userId}` can only be read, created, updated, or deleted by the authenticated, email-verified user whose `request.auth.uid == userId`, and the payload's `ownerId` field must strictly equal `request.auth.uid` and `userId`.
2. **Valid Document ID Guard**: `userId` must match `^[a-zA-Z0-9_\-]+$` with length `1..128`.
3. **Strict Key Allowlist (Anti-Shadow-Update)**: Every `create` and `update` must contain only the exact 11 declared schema keys (`ownerId`, `displayName`, `streakCount`, `longestStreak`, `lastActiveDate`, `quizHighScore`, `quizAttempts`, `masteredIds`, `bookmarkedIds`, `createdAt`, `updatedAt`). Any unknown/ghost key is rejected.
4. **Date & Numeric Bounds**:
   - `lastActiveDate` must be a 10-character string matching `^[0-9]{4}-[0-9]{2}-[0-9]{2}$`.
   - `streakCount` and `longestStreak` must be integers between `1` and `10000`.
   - `quizHighScore` must be an integer between `0` and `100`.
   - `quizAttempts` must be an integer between `0` and `100000`.
5. **Bounded Arrays**: `masteredIds` and `bookmarkedIds` must be lists with `size() <= 100`, and if non-empty, element `[0]` must be a `string` with `size() <= 64`.
6. **Temporal & Immortal Fields**:
   - On `create`: `createdAt == request.time` and `updatedAt == request.time`.
   - On `update`: `ownerId == resource.data.ownerId`, `createdAt == resource.data.createdAt`, and `updatedAt == request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Write**: `auth = null` attempting to create `/userStudyProgress/user_1`.
2. **Unverified Email Spoof**: `auth = { uid: 'user_1', token: { email_verified: false } }` attempting to create `/userStudyProgress/user_1`.
3. **Cross-User Identity Spoofing (Path Mismatch)**: `auth.uid = 'attacker_1'` attempting to write `/userStudyProgress/victim_1`.
4. **Payload OwnerId Spoofing**: `auth.uid = 'user_1'` writing `/userStudyProgress/user_1` with `{ ownerId: 'victim_1', ... }`.
5. **Shadow / Ghost Field Injection on Create**: Payload containing `{ ..., isAdmin: true }`.
6. **Shadow / Ghost Field Injection on Update**: Update payload adding `{ ..., role: 'superuser' }`.
7. **Malformed `lastActiveDate` Format**: `{ ..., lastActiveDate: '18-10-2026' }` or `'2026/10/18'`.
8. **Negative or Out-of-Bounds Streak**: `{ ..., streakCount: 0 }` or `{ ..., streakCount: 999999 }`.
9. **Oversized `displayName` Resource Poisoning**: `displayName` with 500 characters (`> 100`).
10. **Unbounded Array Poisoning**: `masteredIds` containing 105 items (`> 100`) or non-string first element `[12345]`.
11. **Immortal Field Tampering on Update**: Modifying `createdAt` or `ownerId` during an update.
12. **Forged Client Timestamp**: Sending a past or future timestamp instead of `request.time` for `updatedAt`.
