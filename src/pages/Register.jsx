import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Register() {
  const { register } = useAuth() || {};
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const userRef = useRef(null);

  useEffect(() => userRef.current?.focus(), []);

  function validate() {
    if (!username.trim()) return 'Informe nome de usuário';
    if (!email.trim()) return 'Informe o email';
    if (!password) return 'Informe a senha';
    if (password.length < 6) return 'Senha deve ter ao menos 6 caracteres';
    if (password !== confirm) return 'Senhas não conferem';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError('');
    setLoading(true);
    try {
      if (typeof register === 'function') {
        await register({ username, email, password });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" role="dialog" aria-labelledby="register-title">
        <div className="login-brand">
          <div className="logo">GF</div>
          <div>
            <h1 id="register-title">Criar Conta</h1>
            <div className="muted">Registre-se para acessar o painel</div>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="form-error" role="alert">{error}</div>}

          <label className="field">
            <span className="label">Nome de usuário</span>
            <input ref={userRef} value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <div style={{ display: 'flex', gap: 8 }}>
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Senha</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <label className="field" style={{ flex: 1 }}>
              <span className="label">Confirmar senha</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'}
            </button>

            <Link to="/login" className="muted" style={{ fontSize: 13 }}>Já tem conta? Entrar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}