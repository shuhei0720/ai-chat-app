import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMuumg0w61YiKU0stjO3DoFSKlfGnQRZA",
  authDomain: "ai-chat-app-46cb8.firebaseapp.com",
  projectId: "ai-chat-app-46cb8",
  storageBucket: "ai-chat-app-46cb8.firebasestorage.app",
  messagingSenderId: "1058673427245",
  appId: "1:1058673427245:web:272df2ae41b5ca21ed89a4"
};

let app;

if(!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export {auth, db, provider};

// const app = initializeApp(firebaseConfig);