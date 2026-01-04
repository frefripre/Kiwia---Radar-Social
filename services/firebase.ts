// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);