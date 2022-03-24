import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

/**
 * Gets the user document from the Firestore database.
 * @param {String} userId The Discord user ID
 * @returns The user data
 */
export const getUser = async (userId: string) => {
	let user = await db.collection('users').doc(userId).get();
	if (!user.exists) db.collection('users').doc(userId).set({ reputation: 0 });
	user = await db.collection('users').doc(userId).get();
	return user.data();
};
