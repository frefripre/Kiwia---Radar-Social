import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Kiwia: Iniciando aplicación...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Kiwia Error: No se encontró el div #root.");
} else {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Kiwia: App montada ✅");
}