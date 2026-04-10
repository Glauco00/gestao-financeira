import React, { useState } from 'react';
import { useTransactionsContext } from '../context/TransactionsContext';
import { Plus, Wallet, PiggyBank, CreditCard, Trash2, Edit2, Loader2 } from 'lucide-react';
import * as api from '../services/api';
import './Dashboard.css'; // Reutilizando grid e cards

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

export default function Contas() {
  const { accounts, loading, fetchAccounts } = useTransactionsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Carteira', balance: 0 });
  const [submitting, setSubmitting] = useState(false);

  const accountTypes = [
    { value: 'Carteira', icon: <Wallet size={18} /> },
    { value: 'Poupança', icon: <PiggyBank size={18} /> },
    { value: 'Corrente', icon: <CreditCard size={18} /> },
    { value: 'Investimento', icon: <CreditCard size={18} /> }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createAccount(formData);
      await fetchAccounts();
      setIsModalOpen(false);
      setFormData({ name: '', type: 'Carteira', balance: 0 });
    } catch (err) {
      alert('Erro ao criar conta');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta conta e todas as suas transações vinculadas?')) return;
    try {
      await api.deleteAccount(id);
      await fetchAccounts();
    } catch (err) {
      alert('Erro ao excluir conta');
    }
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="welcome">
          <h1>Minhas Contas</h1>
          <p className="muted">Gerencie seus bancos, carteiras e investimentos em um só lugar.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nova Conta
        </button>
      </header>

      {loading && accounts.length === 0 ? (
        <div className="dashboard-loading">
          <Loader2 className="spin" size={40} />
          <p>Carregando contas...</p>
        </div>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', display: 'grid' }}>
          {accounts.map((acc) => (
            <div key={acc.id} className="card glass-card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="icon-box positive" style={{ width: 48, height: 48 }}>
                    {accountTypes.find(t => t.value === acc.type)?.icon || <Wallet size={20} />}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{acc.name}</h3>
                    <span className="muted" style={{ fontSize: 12 }}>{acc.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-icon danger" onClick={() => handleDelete(acc.id)} style={{ padding: 6, border: 'none' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div style={{ marginTop: 24 }}>
                <span className="label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Saldo Atual</span>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>
                  {formatCurrency(acc.balance)}
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>
                {acc.transaction_count || 0} transações vinculadas
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Simples (inline para rapidez) */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <form className="card glass-card" style={{ width: 400, maxWidth: '90%' }} onSubmit={handleSubmit}>
            <h2>Nova Conta</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              <label>
                <span className="label">Nome da Conta / Banco</span>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Nubank, Carteira, Itaú..."
                  required
                />
              </label>
              <label>
                <span className="label">Tipo</span>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Carteira</option>
                  <option>Corrente</option>
                  <option>Poupança</option>
                  <option>Investimento</option>
                </select>
              </label>
              <label>
                <span className="label">Saldo Inicial</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.balance} 
                  onChange={e => setFormData({...formData, balance: e.target.value})}
                  required
                />
              </label>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Criando...' : 'Criar Conta'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}