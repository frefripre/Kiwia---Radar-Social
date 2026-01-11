import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, where, getDocs, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Configuración de Kiwia para kiwiapp-n.firebaseapp.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
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

export { db, collection, doc, where, getDocs, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };
