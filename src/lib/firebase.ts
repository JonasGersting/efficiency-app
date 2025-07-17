import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhsH7ZgWyr_FjmzuCoETpNd0hNQFd0TE0",
  authDomain: "efficiencyapp-a1325.firebaseapp.com",
  projectId: "efficiencyapp-a1325",
  storageBucket: "efficiencyapp-a1325.firebasestorage.app",
  messagingSenderId: "541121276329",
  appId: "1:541121276329:web:bd112d1843ceb43284bcb8",
  measurementId: "G-9M8DREBR47"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();