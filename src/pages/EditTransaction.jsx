import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import * as api from '../services/api';
import './AddTransaction.css';

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTransaction, accounts, loading: txLoading } = useTransactionsContext();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); 
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tx, catRes] = await Promise.all([
          api.getTransaction(id),
          api.fetchCategories()
        ]);

        if (tx) {
          setDescription(tx.description || '');
          setAmount(tx.amount.toString());
          setType(tx.type);
          setCategoryId(tx.category_id?.toString() || '');
          setAccountId(tx.account_id?.toString() || '');
          setDate(tx.date || '');
        }
        
        if (catRes.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar os dados da transação.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!description.trim()) return setError('Informe a descrição');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Informe um valor válido');
    if (!categoryId) return setError('Selecione uma categoria');
    if (!accountId) return setError('Selecione uma conta');

    try {
      setLoading(true);
      await updateTransaction({
        id: parseInt(id),
        description: description.trim(),
        amount: parseFloat(amount),
        type,
        category_id: parseInt(categoryId),
        account_id: parseInt(accountId),
        date
      });
      navigate('/transacoes');
    } catch (err) {
      setError(err.message || 'Falha ao salvar transação');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !description) {
    return <div className="page-loading">Carregando dados da transação...</div>;
  }

  return (
    <div className="add-tx-page">
      <div className="add-tx-card glass-card">
        <header className="add-tx-header">
          <h2>Editar Transação</h2>
          <p className="muted">Altere os detalhes da sua movimentação financeira.</p>
        </header>

        <form className="add-tx-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="type-selector">
            <button 
              type="button" 
              className={`type-btn income ${type === 'income' ? 'active' : ''}`}
              onClick={() => setType('income')}
            >
              Entrada
            </button>
            <button 
              type="button" 
              className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
              onClick={() => setType('expense')}
            >
              Saída
            </button>
          </div>

          <label className="field">
            <span className="label">Descrição</span>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Ex.: Aluguel, Supermercado, Salário..."
            />
          </label>

          <div className="row">
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Valor (R$)</span>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0,00"
              />
            </label>

            <label className="field" style={{ flex: 1 }}>
              <span className="label">Data</span>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>

          <div className="row">
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Categoria</span>
              <div className="select-wrapper">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">-- Selecionar --</option>
                  {categories
                    .filter(c => c.type === type || c.type === 'both')
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))
                  }
                </select>
              </div>
            </label>

            <label className="field" style={{ flex: 1 }}>
              <span className="label">Conta</span>
              <div className="select-wrapper">
                <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                  <option value="">-- Selecionar --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className="add-tx-footer">
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading || txLoading}>
              {loading || txLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
