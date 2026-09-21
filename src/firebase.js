import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot 
} from "firebase/firestore";

// Firebase Configuration sourced from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasValidConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let auth = null;
let provider = null;
let storage = null;
let db = null;

if (hasValidConfig) {
    try {
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();
        storage = getStorage(app);
        db = getFirestore(app);

        // Safe Analytics check
        if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
            isSupported().then(supported => {
                if (supported && app) getAnalytics(app);
            }).catch(() => {});
        }
    } catch (err) {
        console.warn("Firebase initialization warning:", err);
    }
} else {
    console.warn("⚠️ Firebase environment variables not detected on this host. App will operate in resilient local/offline mode without crashing.");
}

export { 
    app,
    auth, 
    provider, 
    storage, 
    db,
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL,
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot 
};