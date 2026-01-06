
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Configuración real de Kiwia proporcionada por el usuario
const firebaseConfig = {
  apiKey: "AIzaSyDwemvNRb7UnjfVpMGbSmGrKw0NIqbJBkM",
  