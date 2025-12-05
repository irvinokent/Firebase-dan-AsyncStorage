// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7YYL4MYb-vkYwMlOKnWLBM4zGinl513s",
  authDomain: "tugasmanajemendata-c0a44.firebaseapp.com",
  projectId: "tugasmanajemendata-c0a44",
  storageBucket: "tugasmanajemendata-c0a44.firebasestorage.app",
  messagingSenderId: "1083415189290",
  appId: "1:1083415189290:web:f075e20c13e509f42f7053",
  measurementId: "G-YKQZH351SK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
