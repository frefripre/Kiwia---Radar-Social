import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Configuración de Kiwia para kiwiapp-n.firebaseapp.com
const firebaseConfig = {
  apiKey: "AIzaSyDwemvNRb7UnjfVpMGbSmGrKw0NIqbJBkM",
  authDomain: "kiwiapp-n.firebaseapp.com",
  databaseURL: "https://kiwiapp-n.firebaseio.com",
  projectId: "kiwiapp-n",
  storageBucket: "kiwiapp-n.firebasestorage.app",
  messagingSenderId: "843695937893",
  appId: "1:843695937893:web:1a5193841d2ad9068fa98c",
  measurementId: "G-SWBQ0HVEPP"
};

export const isConfigDefault = false;

let db: any = null;

try {
  console.log("Kiwia: Iniciando Firebase SDK 10.8.0...");
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Kiwia: Firestore conectado correctamente ✅");
} catch (e) {
  console.error("Kiwia Firebase Error Crítico:", e);
  db = null;
}

export { db, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };