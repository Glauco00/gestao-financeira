import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Loader, AlertCircle } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    if (!email) return setStatus({ type: 'error', message: 'Informe o e-mail válido' });
    if (!password) return setStatus({ type: 'error', message: 'Informe a senha' });

    setLoading(true);

    try {
      if (typeof login === 'function') {
        await login({ email, password });
        navigate(from, { replace: true });
      } else {
        throw new Error('Serviço de autenticação indissponível');
      }
    } catch (err) {
      console.error('Login error', err);
      // Extrai a mensagem de erro da API se existir
      const apiError = err?.response?.data?.message || err?.message || 'Erro de conexão. Verifique o servidor.';
      setStatus({ type: 'error', message: apiError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div className="logo" style={{ 
            width: 56, height: 56, 
            background: 'linear-gradient(135deg, #10b981, #059669)', 
            borderRadius: 16, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            marginBottom: 16
          }}>
            <Wallet size={28} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Gestão Financeira</h1>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>Acesse sua conta para continuar</div>
        </div>

        {status.message && (
          <div style={{ 
            background: status.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', 
            color: status.type === 'error' ? 'var(--danger)' : 'var(--accent)', 
            padding: '12px 16px', 
            borderRadius: 12, 
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.9rem',
            border: `1px solid ${status.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
          }}>
            <AlertCircle size={18} />
            {status.message}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="field" style={{ margin: 0 }}>
            <span className="label">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@exemplo.com"
              required
              disabled={loading}
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
          </label>

          <label className="field" style={{ margin: 0 }}>
            <span className="label">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
          </label>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ padding: '12px', marginTop: 8, fontSize: '1rem' }}
          >
            {loading ? <Loader className="spinner" size={20} /> : 'Entrar na plataforma'}
          </button>
        </form>
      </div>
      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}