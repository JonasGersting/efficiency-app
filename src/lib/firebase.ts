import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { writable } from "svelte/store";

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

/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}
export const user = userStore();
