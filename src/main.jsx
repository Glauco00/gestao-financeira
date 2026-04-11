import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { registerSW } from 'virtual:pwa-register';
import './lib/chartSetup';

// Limpeza forçada de Service Workers antigos que podem estar causando o loop de cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Service Worker desvinculado para limpeza de cache.');
    }
  });
}

// Registrar Service Worker atualizado
registerSW({ immediate: true });

console.log('🚀 Aplicação iniciada com proteções anti-loop v4');

const rootEl = document.getElementById('root');
if (!rootEl) console.error('Elemento #root não encontrado em index.html');
const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);