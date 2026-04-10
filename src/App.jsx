import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionsProvider } from './context/TransactionsContext';
import { SidebarProvider } from './context/SidebarContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transacoes from './pages/Transacoes';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import AddTransaction from './pages/AddTransaction';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TransactionsProvider>
          <SidebarProvider>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />

              {/* Rotas protegidas (exigem autenticação) */}
              <Route element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transacoes" element={<Transacoes />} />
                <Route path="/transacoes/adicionar" element={<AddTransaction />} />
                <Route path="/transacoes/editar/:id" element={<EditTransaction />} />
                <Route path="/contas" element={<Contas />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/config" element={<Configuracoes />} />
              </Route>

              {/* Redirecionamento genérico */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SidebarProvider>
        </TransactionsProvider>
      </AuthProvider>
    </Router>
  );
}