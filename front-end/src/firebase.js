// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5lriq2-PtpXc6rrRcSz6Vb7tWn-bOINQ",
  authDomain: "restaurantdb-d452f.firebaseapp.com",
  projectId: "restaurantdb-d452f",
  storageBucket: "restaurantdb-d452f.firebasestorage.app",
  messagingSenderId: "480923226869",
  appId: "1:480923226869:web:c861866dbf18e2fa052bbc",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
