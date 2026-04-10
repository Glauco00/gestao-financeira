import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { Menu, LogOut, Wallet, User, Bell } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth() || {};
  const { toggle } = useSidebar() || {};
  const navigate = useNavigate();

  function handleLogout() {
    if (typeof logout === 'function') logout();
    navigate('/login');
  }

  function handleToggleSidebar() {
    if (typeof toggle === 'function') toggle();
    const sb = document.querySelector('.sidebar');
    if (!sb) return;

    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    if (isSmall) {
      sb.classList.toggle('open');
      return;
    }

    document.body.classList.toggle('sidebar-collapsed');
    sb.classList.toggle('collapsed');
    sb.classList.remove('open');
  }

  const displayName = user?.username || user?.name || (user?.email ? String(user.email).split('@')[0] : 'Usuário');

  return (
    <header className="header">
      <div className="brand">
        <button className="hamburger btn-icon" onClick={handleToggleSidebar} aria-label="Menu" style={{ border: 'none' }}>
          <Menu size={22} color="var(--text)" />
        </button>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
          <div className="logo">
            <Wallet size={18} color="#fff" />
          </div>
          <div className="logo-text">
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Gestão</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Financeira</div>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Mock Notifications */}
        <button className="btn-icon" style={{ border: 'none', position: 'relative' }} aria-label="Notificações">
          <Bell size={20} color="var(--muted)" />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', border: '2px solid var(--surface-solid)' }}></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{user?.email || 'user@finance.ai'}</div>
          </div>
          <div className="avatar">
            <User size={18} color="var(--text)" />
          </div>
        </div>

        <button onClick={handleLogout} className="btn-icon logout-btn" aria-label="Sair">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}