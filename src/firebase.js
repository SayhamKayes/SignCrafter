import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// REPLACE THESE WITH YOUR ACTUAL KEYS FROM FIREBASE!
const firebaseConfig = {
    apiKey: "AIzaSyB...",
    authDomain: "signcrafter-xxx.firebaseapp.com",
    projectId: "signcrafter-xxx",
    storageBucket: "signcrafter-xxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcde123"
};
// const firebaseConfig = {
//     apiKey: "AIzaSyDCri0rv5xYLUte1na-cRUrrJBQ6_6LjiQ",
//     authDomain: "signcrafter-b4692.firebaseapp.com",
//     projectId: "signcrafter-b4692",
//     storageBucket: "signcrafter-b4692.firebasestorage.app",
//     messagingSenderId: "621232762497",
//     appId: "1:621232762497:web:2978f523b4721f5880e780",
//     measurementId: "G-WCVW8YRC3B"
// };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the tools we need
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

export { signInWithPopup, signOut, ref, uploadBytesResumable, getDownloadURL };