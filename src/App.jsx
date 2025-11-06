import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionsProvider } from './context/TransactionsContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <Router>
          {/* Header */}
          <header style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: 12 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Minha Gestão</Link>
              </div>
              <nav style={{ display: 'flex', gap: 16 }}>
                <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/transacoes" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Transações</Link>
                <Link to="/transacoes/adicionar" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Adicionar</Link>
                <Link to="/register" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Cadastrar</Link>
              </nav>
            </div>
          </header>

          {/* Main layout */}
          <div style={{ maxWidth: 1200, margin: '18px auto', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            {/* Sidebar */}
            <aside style={{ width: 220 }}>
              <div className="card" style={{ padding: 12 }}>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none' }}>Dashboard</Link>
                  <Link to="/transacoes" style={{ color: 'var(--text)', textDecoration: 'none' }}>Transações</Link>
                  <Link to="/transacoes/adicionar" style={{ color: 'var(--text)', textDecoration: 'none' }}>Adicionar transação</Link>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transacoes" element={<Transactions />} />
                <Route path="/transacoes/adicionar" element={<AddTransaction />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TransactionsProvider>
    </AuthProvider>
  );
}