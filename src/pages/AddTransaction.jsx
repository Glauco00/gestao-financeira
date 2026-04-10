import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import * as api from '../services/api';
import './AddTransaction.css';

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction, loading: txLoading } = useTransactionsContext();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // Default to expense
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.fetchCategories();
        // Backend returns { success: true, data: { categories: [] } }
        if (response.success && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (err) {
        console.error('Erro ao carregar categorias', err);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!description.trim()) return setError('Informe a descrição');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Informe um valor válido');
    if (!categoryId) return setError('Selecione uma categoria');

    try {
      setLoading(true);
      await addTransaction({
        description: description.trim(),
        amount: parseFloat(amount),
        type,
        category_id: parseInt(categoryId),
        date
      });
      navigate('/transacoes');
    } catch (err) {
      setError(err.message || 'Falha ao salvar transação');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-tx-page">
      <div className="add-tx-card glass-card">
        <header className="add-tx-header">
          <h2>Nova Transação</h2>
          <p className="muted">Registre uma entrada ou saída no seu controle financeiro.</p>
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

          <label className="field">
            <span className="label">Categoria</span>
            <div className="select-wrapper">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">-- Selecionar Categoria --</option>
                {categories
                  .filter(c => c.type === type || c.type === 'both')
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))
                }
              </select>
            </div>
          </label>

          <div className="add-tx-footer">
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading || txLoading}>
              {loading || txLoading ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}