import React from 'react';
import './Header.css'; // <-- garantir que existe e é importado
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export default function Header(props) {
  const { user, logout } = useAuth() || {};
  const { toggle } = useSidebar() || {};
  const navigate = useNavigate();

  // debug rápido para inspecionar o objeto user
  console.debug('Header user:', user);

  function handleLogout() {
    if (typeof logout === 'function') logout();
    navigate('/login');
  }

  function handleToggleSidebar() {
    // chama toggle do contexto, se existir
    if (typeof toggle === 'function') toggle();

    const sb = document.querySelector('.sidebar');
    if (!sb) return;

    // em telas pequenas, alterna apenas .open
    const isSmall = window.matchMedia('(max-width: 760px)').matches;
    if (isSmall) {
      sb.classList.toggle('open');
      // no mobile não altera body-collapsed para não conflitar
      return;
    }

    // em telas maiores, alterna estado colapsado do body e também .collapsed
    document.body.classList.toggle('sidebar-collapsed');
    sb.classList.toggle('collapsed');

    // se usuário abriu manualmente no desktop, remover flag .open (consistência)
    sb.classList.remove('open');
  }

  // prioriza username (do register), depois name, depois parte antes do @ do email
  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? String(user.email).split('@')[0] : 'Usuário');

  return (
    <header className="header">
      <div className="brand">
        <button className="hamburger" onClick={handleToggleSidebar} aria-label="Abrir/fechar menu">
          {/* ...ícone... */}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="logo">GF</div>
          <div>
            <div style={{ fontWeight: 800 }}>Gestão Financeira</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Painel</div>
          </div>
        </div>
      </div>

      <nav className="header-nav">
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink></li>
          <li><NavLink to="/transacoes" className={({ isActive }) => (isActive ? 'active' : '')}>Transações</NavLink></li>
          {/* REMOVIDO: link para Metas */}
          <li><NavLink to="/relatorios" className={({ isActive }) => (isActive ? 'active' : '')}>Relatórios</NavLink></li>
        </ul>
      </nav>

      <div className="user" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700 }}>{displayName}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.email || ''}</div>
        </div>
        <button onClick={handleLogout} style={{ marginLeft: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text)', padding: '6px 10px', borderRadius: 8 }}>
          Sair
        </button>
      </div>
    </header>
  );
}