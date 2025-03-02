import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from 'firebase-admin/storage';

const serviceAccountJsonData = process.env['MY_FIREBASE_SERVICE_ACCOUNT_JSON_DATA']
const serviceAccountKey = JSON.parse(serviceAccountJsonData ?? "{}");

if(!getApps().length) {
  initializeApp({
    credential: cert(serviceAccountKey),
    // credential: cert({
    //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //   privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    //   projectId: process.env.FIREBASE_PROJECT_ID,
    // }),
    storageBucket: 'ai-chat-app-46cb8.firebasestorage.app'
  });
} else {
  getApp();
}

const db = getFirestore();
const bucket = getStorage().bucket();

export { db, bucket };