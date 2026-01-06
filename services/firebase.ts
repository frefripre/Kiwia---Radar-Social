
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// REEMPLAZA ESTOS DATOS con los de tu proyecto en console.firebase.google.com
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const isStandby = false;

// Helpers para Firestore
export { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };
