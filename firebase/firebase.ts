import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectID = process.env.NEXT_PUBLIC_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectID,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderID,
  appId: appID,
  measurementId: measurementID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize analytics
// export const analytics = getAnalytics();

// Initialize Auth
export const auth = getAuth(app);

// Initialize database
export const db = getFirestore(app);

// collectionRefs
export const userRef = collection(db, "users");
export const playlistsRef = collection(db, "playlists");
export const playlistsContRef = collection(db, "playlistsCont");

export const authProvider = new GoogleAuthProvider();
