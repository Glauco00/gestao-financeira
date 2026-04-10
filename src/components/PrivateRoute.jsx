import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

export default function PrivateRoute({ children }) {
  const { user, loadingInitial } = useAuth();
  const location = useLocation();

  if (loadingInitial) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader className="spinner" size={48} color="var(--accent)" />
        <style>{`
          .spinner { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!user) {
    // Redirecionar para o login, preservando a intenção da rota original
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
