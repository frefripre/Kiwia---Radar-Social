import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, where, getDocs, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Acceso seguro a variables de entorno para evitar Uncaught TypeError
const getEnv = (key: string) => {
  try {
    // Comprobación robusta de import.meta y su propiedad env
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
    return "";
  } catch (e) {
    return "";
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_APIKEY'),
  authDomain: getEnv('VITE_AUTHDOMAIN'),
  databaseURL: getEnv('VITE_DATABASEURL'),
  projectId: getEnv('VITE_PROJECTID'),
  storageBucket: getEnv('VITE_STORAGEBUCKET'),
  messagingSenderId: getEnv('VITE_MESSAGINGSENDERID'),
  appId: getEnv('VITE_APPID'),
  measurementId: getEnv('VITE_MEASUREMENTID')
};

export const isConfigDefault = !firebaseConfig.apiKey;

let db: any = null;

if (!isConfigDefault) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Kiwia: Firestore conectado ✅");
  } catch (e) {
    console.warn("Kiwia: Falló inicialización de Firebase. Usando modo offline.");
  }
} else {
  console.log("Kiwia: Ejecutando en modo Demo (Sin Firebase Config)");
}

export { db, collection, doc, where, getDocs, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };