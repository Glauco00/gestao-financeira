import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import './Sidebar.css';

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  const handleNavClick = () => {
    if (window.innerWidth <= 900) close();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Sidebar navigation">
      <div className="brand-mini">
        <div className="logo" />
        <div style={{ fontWeight: 700 }}>finance.ai</div>
      </div>

      <ul>
        <li><NavLink to="/" end onClick={handleNavClick} className={({isActive}) => (isActive ? 'active' : '')}>Dashboard</NavLink></li>
        <li><NavLink to="/transacoes" onClick={handleNavClick} className={({isActive}) => (isActive ? 'active' : '')}>Transações</NavLink></li>
        <li><NavLink to="/metas" onClick={handleNavClick} className={({isActive}) => (isActive ? 'active' : '')}>Metas</NavLink></li>
        <li><NavLink to="/relatorios" onClick={handleNavClick} className={({isActive}) => (isActive ? 'active' : '')}>Relatórios</NavLink></li>
        <li><NavLink to="/config" onClick={handleNavClick} className={({isActive}) => (isActive ? 'active' : '')}>Configurações</NavLink></li>
      </ul>
    </aside>
  );
}