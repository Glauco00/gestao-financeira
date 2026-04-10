import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // <-- import do estilo

export default function Login() {
  const auth = useAuth() || {};
  const login = auth.login;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e?.preventDefault();
    setError('');
    if (!email) return setError('Informe o email');
    if (!password) return setError('Informe a senha');

    try {
      let res;
      if (typeof login === 'function') {
        // suporta login(email, password) ou login({email, password})
        res = login.length >= 2 ? await login(email, password) : await login({ email, password });
      }
      // se login retornar false/undefined, tratar como falha
      if (res === false || res === undefined) {
        setError('Credenciais inválidas');
        return;
      }
      navigate('/');
    } catch (err) {
      console.error('Login error', err);
      setError('Erro ao autenticar. Verifique o console.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo">GF</div>
          <div>
            <h1>Gestão Financeira</h1>
            <div className="muted">Painel</div>
          </div>
        </div>

        {error && <div style={{ color: 'var(--danger, #ef4444)', marginBottom: 8 }}>{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@exemplo.com"
              required
            />
          </label>

          <label className="field">
            <span className="label">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
            />
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Entrar</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/register')}>Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}