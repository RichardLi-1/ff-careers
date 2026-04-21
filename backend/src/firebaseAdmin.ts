import { initializeApp, getApps, cert } from 'firebase-admin/app';   
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';     

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const auth = getAuth();
const db = getFirestore(); // 🔥 Firestore database

// ✅ Export auth & provider for use in auth.js
export { auth, db };