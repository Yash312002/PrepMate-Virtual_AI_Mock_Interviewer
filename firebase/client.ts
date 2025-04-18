// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA60TnrjMu8cLolK_tkLtdD_k4AV0bT16w",
  authDomain: "prepmate-8115d.firebaseapp.com",
  projectId: "prepmate-8115d",
  storageBucket: "prepmate-8115d.firebasestorage.app",
  messagingSenderId: "352925048595",
  appId: "1:352925048595:web:b2bbe7818c9d6e23bc44e6",
  measurementId: "G-ZP9ZF9HPD4"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);