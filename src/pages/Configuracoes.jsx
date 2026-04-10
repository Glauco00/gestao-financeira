import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, LogOut, Save, X, Edit2, Loader } from 'lucide-react';
import './Configuracoes.css';

export default function Configuracoes() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (e) {
      console.error('Erro ao deslogar', e);
    }
  }

  async function handleSave(e) {
    e?.preventDefault();
    setStatus({ type: '', message: '' });
    
    if (!name || !email) {
      return setStatus({ type: 'error', message: 'Nome e e-mail são obrigatórios.' });
    }

    try {
      setLoading(true);
      await updateProfile({ name: name.trim(), email: email.trim() });
      setStatus({ type: 'success', message: 'Perfil atualizado com sucesso!' });
      setEditing(false);
    } catch (err) {
      console.error('Erro atualizando perfil', err);
      setStatus({ type: 'error', message: err.message || 'Falha ao atualizar perfil.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    const nova = prompt('Informe a nova senha (mínimo 6 caracteres):');
    if (!nova) return;
    if (nova.length < 6) {
      return setStatus({ type: 'error', message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    try {
      setLoading(true);
      await changePassword(nova);
      setStatus({ type: 'success', message: 'Senha alterada com sucesso!' });
    } catch (err) {
      console.error('Erro alterando senha', err);
      setStatus({ type: 'error', message: err.message || 'Falha ao alterar senha.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-config">
      <div className="page-header">
        <h1>Configurações</h1>
        <p className="muted">Gerencie sua identidade e preferências de segurança.</p>
      </div>

      <div className="config-grid">
        <div className="card config-card main-profile">
          <header className="account-header">
            <div className="avatar-wrapper">
              <div className="avatar Large">
                {(user?.name && user.name[0]) || 'U'}
              </div>
              {!editing && (
                <button className="edit-badge" onClick={() => setEditing(true)}>
                  <Edit2 size={14} />
                </button>
              )}
            </div>

            <div className="account-info">
              <h2 className="account-name">{user?.name || 'Usuário'}</h2>
              <div className="account-email muted">
                <Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                {user?.email || '—'}
              </div>
            </div>
          </header>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-section">
              <label className="field">
                <span className="label">Nome Completo</span>
                <div className="input-with-icon">
                  <User size={18} className="icon" />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={!editing} 
                    placeholder="Seu nome"
                  />
                </div>
              </label>

              <label className="field">
                <span className="label">Endereço de E-mail</span>
                <div className="input-with-icon">
                  <Mail size={18} className="icon" />
                  <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={!editing} 
                    placeholder="seu@email.com"
                  />
                </div>
              </label>
            </div>

            {status.message && (
              <div className={`status-msg ${status.type}`}>
                {status.message}
              </div>
            )}

            <div className="config-footer">
              {editing ? (
                <div className="actions-row">
                  <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? <Loader className="spinner" size={18} /> : <><Save size={18} /> Salvar Alterações</>}
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => { setEditing(false); setStatus({type:'', message:''}); }}>
                    <X size={18} /> Cancelar
                  </button>
                </div>
              ) : (
                <div className="actions-row">
                  <button type="button" className="btn-outline" onClick={handleChangePassword} disabled={loading}>
                    <Lock size={18} /> Alterar Senha
                  </button>
                  <div style={{ flex: 1 }} />
                  <button type="button" className="btn-danger-ghost" onClick={handleLogout}>
                    <LogOut size={18} /> Sair da Conta
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="config-sidebar-cards">
          <div className="card glass-card info-card">
            <h3>Segurança</h3>
            <p className="muted">Sua conta utiliza criptografia de ponta a ponta para proteger seus dados financeiros.</p>
            <div className="security-badge">
              <div className="dot active"></div>
              Proteção Ativa
            </div>
          </div>
          
          <div className="card glass-card info-card">
            <h3>Sessão Atual</h3>
            <div className="session-detail">
              <span className="label">Último Acesso</span>
              <span className="value">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="session-detail">
              <span className="label">Status</span>
              <span className="value success">Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}