// Modular Firebase initialization for v9+
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Configuración real de Kiwia
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

let app;
let db: any = null;

try {
  console.log("Kiwia: Conectando a Firebase...");
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Kiwia: Firebase conectado correctamente ✅");
} catch (e) {
  console.error("Kiwia Firebase Error: No se pudo conectar. La app funcionará en modo offline/limitado.", e);
  db = null;
}

export { db, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };
