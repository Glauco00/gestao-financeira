import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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

const routes = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: (
      <Private>
        <Layout />
      </Private>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'transacoes', element: <Transacoes /> },
      { path: 'transacoes/adicionar', element: <AddTransaction /> },
      { path: 'metas', element: <Metas /> },
      { path: 'relatorios', element: <Relatorios /> },
      { path: 'config', element: <Configuracoes /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}