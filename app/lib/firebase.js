import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};



const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log("Auth domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("AuthDomain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("Current origin:", window.location.origin);

export { auth, googleProvider };