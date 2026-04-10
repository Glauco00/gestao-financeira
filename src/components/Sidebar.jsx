import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // <-- garantir que existe e é importado

export default function Sidebar() {
  // Fecha a sidebar automaticamente em telas pequenas
  function closeOnMobile() {
    try {
      if (window.matchMedia('(max-width:760px)').matches) {
        const sb = document.querySelector('.sidebar');
        if (sb) sb.classList.remove('open');
      }
    } catch (e) {
      // noop
    }
  }

  return (
    <aside className="sidebar">
      {/* Marca / topo da sidebar: ícone de IA antes de finance.ai */}
      <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px' }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg,#06b6d4,#16a34a)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.93 4.93l1.41 1.41" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.66 17.66l1.41 1.41" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12h2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 12h2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.93 19.07l1.41-1.41" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.66 6.34l1.41-1.41" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>finance.ai</span>
          <small style={{ color: 'var(--muted)', fontSize: 12 }}>Assistente IA</small>
        </div>
      </div>

      {/* restante do menu lateral (links, footer, etc.) */}
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/" end onClick={closeOnMobile}>Dashboard</NavLink></li>
          <li><NavLink to="/transacoes" onClick={closeOnMobile}>Transações</NavLink></li>
          <li><NavLink to="/relatorios" onClick={closeOnMobile}>Relatórios</NavLink></li>
          <li><NavLink to="/config" onClick={closeOnMobile}>Configurações</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}