import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css'; // <-- importa o CSS global do projeto
import './lib/chartSetup';

const rootEl = document.getElementById('root');
if (!rootEl) console.error('Elemento #root não encontrado em index.html');
const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);