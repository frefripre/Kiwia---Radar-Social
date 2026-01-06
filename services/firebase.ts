import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
// REEMPLAZA ESTOS DATOS con los de tu proyecto en console.firebase.google.com
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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const isStandby = false;
// Helpers para Firestore
export { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };