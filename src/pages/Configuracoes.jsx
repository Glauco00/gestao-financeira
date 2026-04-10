import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Configuracoes.css';

export default function Configuracoes() {
  const auth = useAuth() || {};
  const user = auth.user || {};
  const logout = auth.logout;
  const updateProfile = auth.updateProfile; // opcional
  const changePassword = auth.changePassword; // opcional
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user]);

  async function handleLogout() {
    try {
      if (typeof logout === 'function') await logout();
    } catch (e) {
      console.error('Erro ao deslogar', e);
    } finally {
      navigate('/login', { replace: true });
    }
  }

  async function handleSave(e) {
    e?.preventDefault();
    setMsg('');
    if (!name || !email) return setMsg('Nome e email são obrigatórios.');
    if (typeof updateProfile !== 'function') {
      return setMsg('Atualização de perfil não disponível.');
    }
    try {
      setLoading(true);
      await updateProfile({ name: name.trim(), email: email.trim() });
      setMsg('Perfil atualizado com sucesso.');
      setEditing(false);
    } catch (err) {
      console.error('Erro atualizando perfil', err);
      setMsg('Falha ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (typeof changePassword !== 'function') {
      setMsg('Alteração de senha não disponível.');
      return;
    }
    const nova = prompt('Informe a nova senha:');
    if (!nova) return;
    try {
      setLoading(true);
      await changePassword(nova);
      setMsg('Senha alterada com sucesso.');
    } catch (err) {
      console.error('Erro alterando senha', err);
      setMsg('Falha ao alterar senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-config">
      <div className="page-header">
        <h1>Configurações</h1>
        <p className="muted">Gerencie sua conta e preferências.</p>
      </div>

      <div className="card config-card">
        <header className="account-header">
          <div className="avatar" title={user.name || 'Usuário'}>
            {(user.name && user.name[0]) || 'U'}
          </div>

          <div className="account-info">
            <div className="account-name">{user.name || 'Usuário'}</div>
            <div className="account-email muted">{user.email || '—'}</div>
            {user.createdAt && (
              <div className="account-meta muted">Membro desde {new Date(user.createdAt).toLocaleDateString()}</div>
            )}
          </div>
        </header>

        <form className="profile-form" onSubmit={handleSave}>
          <h3>Dados da conta</h3>

          <label className="field">
            <span className="label">Nome</span>
            <input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
          </label>

          <div className="config-actions">
            {editing ? (
              <>
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setEditing(false); setMsg(''); }}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-primary" onClick={() => setEditing(true)}>Editar perfil</button>
                <button type="button" className="btn-secondary" onClick={handleChangePassword}>Alterar senha</button>
              </>
            )}

            <div style={{ flex: 1 }} />

            <button type="button" className="btn-logout" onClick={handleLogout}>Sair</button>
          </div>

          {msg && <div className="form-msg">{msg}</div>}
        </form>
      </div>
    </div>
  );
}