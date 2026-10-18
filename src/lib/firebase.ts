import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { StudyProgressState } from '../types/atlas.ts';
import { getLocalDateString } from '../utils/studyLogic.ts';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore on boot per skill directive
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation constants synchronized verbatim with firebase-blueprint.json & firestore.rules
const ID_PATTERN = /^[a-zA-Z0-9_\-]+$/;
const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const DISPLAY_NAME_MAX_LENGTH = 100;
const ARRAY_MAX_ITEMS = 100;

function sanitizeStringArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item) => typeof item === 'string' && item.length >= 1 && item.length <= 64)
    .slice(0, ARRAY_MAX_ITEMS);
}

export async function signInWithGooglePopup(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged, type User };

export async function fetchUserStudyProgress(
  userId: string
): Promise<Partial<StudyProgressState> | null> {
  if (!ID_PATTERN.test(userId) || userId.length > 128) {
    return null;
  }
  const docPath = `userStudyProgress/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'userStudyProgress', userId));
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    return {
      streakCount: typeof data.streakCount === 'number' ? data.streakCount : 1,
      longestStreak: typeof data.longestStreak === 'number' ? data.longestStreak : 1,
      lastActiveDate: typeof data.lastActiveDate === 'string' ? data.lastActiveDate : getLocalDateString(),
      quizHighScore: typeof data.quizHighScore === 'number' ? data.quizHighScore : 0,
      quizAttempts: typeof data.quizAttempts === 'number' ? data.quizAttempts : 0,
      masteredIds: Array.isArray(data.masteredIds) ? data.masteredIds : [],
      bookmarkedIds: Array.isArray(data.bookmarkedIds) ? data.bookmarkedIds : [],
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

export async function syncUserStudyProgressToFirestore(
  user: User,
  progress: StudyProgressState
): Promise<void> {
  if (!user?.uid || !ID_PATTERN.test(user.uid) || user.uid.length > 128) {
    return;
  }
  if (!user.emailVerified) {
    return;
  }

  const docPath = `userStudyProgress/${user.uid}`;
  const docRef = doc(db, 'userStudyProgress', user.uid);

  const rawDisplayName = (user.displayName || user.email?.split('@')[0] || 'Developer').trim();
  const safeDisplayName = rawDisplayName.slice(0, DISPLAY_NAME_MAX_LENGTH) || 'Developer';

  const rawDate = progress.lastActiveDate || getLocalDateString();
  const safeLastActiveDate = DATE_PATTERN.test(rawDate) ? rawDate : getLocalDateString();

  const safeStreakCount = Math.min(10000, Math.max(1, Math.floor(progress.streakCount || 1)));
  const safeLongestStreak = Math.min(
    10000,
    Math.max(safeStreakCount, Math.floor(progress.longestStreak || 1))
  );
  const safeQuizHighScore = Math.min(100, Math.max(0, Math.floor(progress.quizHighScore || 0)));
  const safeQuizAttempts = Math.min(100000, Math.max(0, Math.floor(progress.quizAttempts || 0)));
  const safeMasteredIds = sanitizeStringArray(progress.masteredIds);
  const safeBookmarkedIds = sanitizeStringArray(progress.bookmarkedIds);

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        ownerId: user.uid,
        displayName: safeDisplayName,
        streakCount: safeStreakCount,
        longestStreak: safeLongestStreak,
        lastActiveDate: safeLastActiveDate,
        quizHighScore: safeQuizHighScore,
        quizAttempts: safeQuizAttempts,
        masteredIds: safeMasteredIds,
        bookmarkedIds: safeBookmarkedIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        displayName: safeDisplayName,
        streakCount: safeStreakCount,
        longestStreak: safeLongestStreak,
        lastActiveDate: safeLastActiveDate,
        quizHighScore: safeQuizHighScore,
        quizAttempts: safeQuizAttempts,
        masteredIds: safeMasteredIds,
        bookmarkedIds: safeBookmarkedIds,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
