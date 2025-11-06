import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    register({ email });
    navigate('/');
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto' }}>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
        <button type="submit">Criar conta</button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}