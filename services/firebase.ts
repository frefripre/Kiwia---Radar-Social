import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Configuración de Kiwia para kiwiapp-n.firebaseapp.com
const firebaseConfig = {
  apiKey: import.meta.env.APIKEY,
  authDomain: import.meta.env.AUTHDOMAIN,
  databaseURL: import.meta.env.DATABASEURL,
  projectId: import.meta.env.PROJECTID,
  storageBucket: import.meta.env.STORAGEBUCKET,
  messagingSenderId: import.meta.env.MESSAGINGSENDERID,
  appId: import.meta.env.APPID,
  measurementId: import.meta.env.MEASUREMENTID
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