import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="brand">
        <button onClick={toggle} aria-label="Toggle sidebar" style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer' }}>
          ☰
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="logo">GF</div>
          <div>
            <div style={{ fontWeight: 800 }}>Gestão Financeira</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Painel</div>
          </div>
        </div>
      </div>

      <nav>
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink></li>
          <li><NavLink to="/transacoes" className={({ isActive }) => (isActive ? 'active' : '')}>Transações</NavLink></li>
          <li><NavLink to="/metas" className={({ isActive }) => (isActive ? 'active' : '')}>Metas</NavLink></li>
          <li><NavLink to="/relatorios" className={({ isActive }) => (isActive ? 'active' : '')}>Relatórios</NavLink></li>
        </ul>
      </nav>

      <div className="user">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700 }}>{user?.name || 'Usuário'}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.email}</div>
        </div>
        <button onClick={handleLogout} style={{ marginLeft: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text)', padding: '6px 10px', borderRadius: 8 }}>
          Sair
        </button>
      </div>
    </header>
  );
}