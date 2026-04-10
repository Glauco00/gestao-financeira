import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionsProvider } from './context/TransactionsContext';
import { SidebarProvider } from './context/SidebarContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transacoes from './pages/Transacoes';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import AddTransaction from './pages/AddTransaction';

export default function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              {/* rotas de autenticação fora do layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* rotas que usam o layout (header + sidebar) */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transacoes" element={<Transacoes />} />
                <Route path="/transacoes/adicionar" element={<AddTransaction />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/config" element={<Configuracoes />} /> {/* ADICIONADO */}
                {/* adicionar outras rotas internas aqui */}
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SidebarProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}