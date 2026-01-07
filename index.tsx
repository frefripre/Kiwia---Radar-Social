
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Kiwia: Iniciando punto de entrada...");
console.log("Kiwia: Verificando carga de App component...", !!App);

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Kiwia Error: No se encontró el elemento #root en el DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Kiwia: Renderizado inicial ejecutado.");
  } catch (err) {
    console.error("Kiwia Crash:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #ff4444; background: #111; font-family: 'Plus Jakarta Sans', sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <span style="font-size: 64px; margin-bottom: 20px;">🥝</span>
        <h1 style="font-weight: 800; text-transform: uppercase; letter-spacing: -0.05em;">Error de Carga</h1>
        <p style="opacity: 0.6; font-size: 14px; max-width: 300px; margin-bottom: 24px;">No se pudo iniciar la aplicación. Revisa la consola para más detalles.</p>
        <pre style="background: #000; padding: 16px; border-radius: 12px; font-size: 10px; color: #888; overflow-x: auto; max-width: 100%;">${err instanceof Error ? err.message : String(err)}</pre>
        <button onclick="window.location.reload()" style="margin-top: 32px; background: #84cc16; color: #000; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer;">REINTENTAR</button>
      </div>
    `;
  }
}
