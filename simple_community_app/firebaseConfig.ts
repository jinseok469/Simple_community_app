// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDguVUa29-WjRsPx3o08jGV0izRoRlcSiU",
  authDomain: "native-6c33e.firebaseapp.com",
  projectId: "native-6c33e",
  storageBucket: "native-6c33e.firebasestorage.app",
  messagingSenderId: "968854270347",
  appId: "1:968854270347:web:a3faf71a7faa8916f47f8e",
  measurementId: "G-3RQ1WFKD6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);