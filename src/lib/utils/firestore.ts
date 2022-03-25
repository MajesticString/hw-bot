import { getFirestore } from 'firebase-admin/firestore';

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
