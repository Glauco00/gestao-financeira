import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Transacoes from '../pages/Transacoes';
import AddTransaction from '../pages/AddTransaction';
import Metas from '../pages/Metas';
import Relatorios from '../pages/Relatorios';
import Configuracoes from '../pages/Configuracoes';

function Private({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Private>
              <Layout />
            </Private>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transacoes" element={<Transacoes />} />
          <Route path="transacoes/adicionar" element={<AddTransaction />} />
          <Route path="metas" element={<Metas />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="config" element={<Configuracoes />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}