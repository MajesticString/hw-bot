import { getFirestore } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';

const db = getFirestore();

/**
 * The data included in a user object
 */
export interface UserData {
  reputation: number;
}

/**
 * Gets the user document from the Firestore database.
 * @param {String} userId The Discord user ID
 * @returns The user data
 */
export const getUser = async (userId: string): Promise<UserData> => {
  let user = await db.collection('users').doc(userId).get();
  if (!user.exists) db.collection('users').doc(userId).set({ reputation: 0 });
  user = await db.collection('users').doc(userId).get();
  return <UserData>user.data();
};

export const getGrade = async (grade: number | string) => {
  if (typeof grade === 'number') grade = `${grade}th`;
  const gradeDoc = await db.collection('assignments').doc(grade).get();
  return gradeDoc.data();
};

export type Subjects = 'science' | 'math' | 'english' | 'history';

export const getClass = async (grade: number | string, subject: Subjects) => {
  const gradeDoc = await db
    .collection(
      `assignments/${
        typeof grade === 'string' ? grade : `${grade}th`
      }/${subject}`
    )
    .get();
  return gradeDoc;
};

export function normalizeGrade(grade: number | string, type: 'number'): number;
export function normalizeGrade(grade: number | string, type: 'string'): string;
export function normalizeGrade(
  grade: number | string,
  type: 'number' | 'string'
): string | number {
  let normalizedGrade: string | undefined;
  if (typeof grade === 'number') normalizedGrade = `${grade}th`;
  if (typeof grade === 'string' && grade.includes('th'))
    normalizedGrade = grade;
  if (typeof grade === 'string' && !grade.includes('th'))
    normalizedGrade = `${grade}th`;
  if (!normalizedGrade) return grade.toString();

  return type === 'string' ? normalizedGrade : normalizedGrade.slice(0, -2);
}

export const getAssignment = async (
  grade: number | string,
  subject: Subjects,
  assignment: string
) => {
  const gradeDoc = await db
    .collection(
      `assignments/${
        typeof grade === 'string' ? grade : `${grade}th`
      }/${subject}`
    )
    .doc(assignment)
    .get();
  return gradeDoc.data();
};
export const addAssignment = async (
  name: string,
  grade: number,
  subject: Subjects,
  dueDate: string,
  description: string
) => {
  const timestamp = DateTime.fromISO(dueDate).toMillis();
  return await db
    .collection(`assignments/${grade}th/${subject}`)
    .doc(timestamp.toString())
    .set({
      description,
      name,
      grade,
      subject,
      dueDate: timestamp,
    });
};
