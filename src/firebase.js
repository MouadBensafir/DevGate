// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm89tFdihn2LJpGw9P6IU_2X_M_SkCFMw",
  authDomain: "devgate-ead23.firebaseapp.com",
  projectId: "devgate-ead23",
  storageBucket: "devgate-ead23.firebasestorage.app",
  messagingSenderId: "973898534082",
  appId: "1:973898534082:web:dba6d0056aecdaba95ff5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
