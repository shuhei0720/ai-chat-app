import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getApp, getApps } from "firebase/app";

if(!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
} else {
  getApp();
}
