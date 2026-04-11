import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { registerSW } from 'virtual:pwa-register';
import './lib/chartSetup';

// Registrar Service Worker para habilitar o PWA
registerSW({ 
  immediate: true,
  onNeedRefresh() {
    console.log('Nova versão disponível. Recarregando...');
  },
  onOfflineReady() {
    console.log('App pronto para uso offline.');
  }
});

console.log('🚀 Sistema pronto com PWA reativado.');

const rootEl = document.getElementById('root');
if (!rootEl) console.error('Elemento #root não encontrado em index.html');
const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);