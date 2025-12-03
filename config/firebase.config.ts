// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { env } from "./env.config";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

if (!env.firebase.apiKey) {
  throw new Error("Firebase API key is not set");
}
if (!env.firebase.authDomain) {
  throw new Error("Firebase auth domain is not set");
}
if (!env.firebase.projectId) {
  throw new Error("Firebase project id is not set");
}
if (!env.firebase.storageBucket) {
  throw new Error("Firebase storage bucket is not set");
}
if (!env.firebase.messagingSenderId) {
  throw new Error("Firebase messaging sender id is not set");
}
if (!env.firebase.appId) {
  throw new Error("Firebase app id is not set");
}
if (!env.firebase.measurementId) {
  throw new Error("Firebase measurement id is not set");
}
const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  measurementId: env.firebase.measurementId,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
