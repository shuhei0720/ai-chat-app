import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from 'firebase-admin/storage';

if(!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: 'ai-chat-app-46cb8.firebasestorage.app'
  });
} else {
  getApp();
}

const db = getFirestore();
const bucket = getStorage().bucket();

export {db, bucket};