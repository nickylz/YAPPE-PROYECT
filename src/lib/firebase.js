import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSmwTgiqkhDen91dlG9vrkj6m6P6QtQoE",
  authDomain: "lolaso-e3e6d.firebaseapp.com",
  projectId: "lolaso-e3e6d",
  storageBucket: "lolaso-e3e6d.firebasestorage.app",
  messagingSenderId: "367492297009",
  appId: "1:367492297009:web:4f06886cc0f2a5bfc74010",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
