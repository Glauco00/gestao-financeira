import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, PieChart, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  function closeOnMobile() {
    try {
      if (window.matchMedia('(max-width:768px)').matches) {
        const sb = document.querySelector('.sidebar');
        if (sb) sb.classList.remove('open');
      }
    } catch (e) {
      // noop
    }
  }

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} strokeWidth={2} />, label: "Dashboard", end: true },
    { to: "/transacoes", icon: <ArrowRightLeft size={20} strokeWidth={2} />, label: "Transações" },
    { to: "/relatorios", icon: <PieChart size={20} strokeWidth={2} />, label: "Relatórios" },
    { to: "/config", icon: <Settings size={20} strokeWidth={2} />, label: "Configurações" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand-mini" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px 24px', opacity: 0.5 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Menu Principal</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                end={item.end}
                onClick={closeOnMobile}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom Area Component for Pro Plan or Support could go here */}
      <div className="sidebar-bottom">
        <div className="premium-card">
          <div className="premium-icon">✨</div>
          <div className="premium-title">Pro Plan</div>
          <div className="premium-desc">Desbloqueie todos os recursos</div>
        </div>
      </div>
    </aside>
  );
}