import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAxjc9lh4fOIiGJNMtdNpqZktlIhNxhA_U",
  authDomain: "borrowit-24c8b.firebaseapp.com",
  projectId: "borrowit-24c8b",
  storageBucket: "borrowit-24c8b.firebasestorage.app",
  messagingSenderId: "368972172208",
  appId: "1:368972172208:web:f58b2cbd9b5f4c624de475"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);