import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBw1Sc7fRZ28mWr8ozB6rMY2XYvs-r96Gw",
  authDomain: "ff-careers.firebaseapp.com",
  projectId: "ff-careers",
  storageBucket: "ff-careers.firebasestorage.app",
  messagingSenderId: "958595305310",
  appId: "1:958595305310:web:cd53bb9c2cae3ca339c9cf",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

async function signInWithGoogle(idToken?: string) {
  if (Platform.OS === 'web') {
    return signInWithPopup(auth, googleProvider);
  }
  if (!idToken) throw new Error('idToken required on native');
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export { auth, signInWithGoogle };
