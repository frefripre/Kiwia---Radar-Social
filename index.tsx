import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// import Firebase from './services/firebase.ts'
import { db, collection, doc, where, getDocs, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from './services/firebase.ts';


console.log("Kiwia: Iniciando aplicación...");

const rootElement = document.getElementById('root');

console.log('================================================');

// async function getCities(db) {
//   console.log('00000000');
//
//   const citiesCol = Firebase.collection(db, 'users');
//   const citySnapshot = await Firebase.getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   console.log(cityList)
//   return cityList;
// }

// const users = collection(db, 'users');
// const q = query(users, where("name", "==", "Felipe"));
// const snapshot = await getDocs(q);
// console.log(snapshot);

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});


console.log('================================================');


if (!rootElement) {
  console.error("Kiwia Error: No se encontró el div #root.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Kiwia: Render inicial completado ✅");
  } catch (err) {
    console.error("Kiwia Render Crash:", err);
    rootElement.innerHTML = `
      <div style="background: #111; color: white; padding: 40px; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <span style="font-size: 50px;">🥝</span>
        <h1 style="color: #ff4444; margin: 20px 0;">Error Crítico</h1>
        <p style="opacity: 0.7; max-width: 400px;">Hubo un problema al montar React. Limpia la caché del navegador y reintenta.</p>
        <pre style="background: #000; padding: 20px; border-radius: 10px; font-size: 11px; margin-top: 20px; border: 1px solid #333; max-width: 90%; overflow-x: auto;">${err instanceof Error ? err.message : String(err)}</pre>
        <button onclick="location.reload()" style="margin-top: 30px; background: #84cc16; color: black; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;">Reiniciar App</button>
      </div>
    `;
  }
}
