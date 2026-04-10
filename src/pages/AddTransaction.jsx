import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import './AddTransaction.css';

function todayLocalYYYYMMDD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toDateString(v) {
  if (!v) return todayLocalYYYYMMDD();
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (typeof v === 'string' && v.length >= 10) return v.slice(0, 10);
  if (v instanceof Date && !isNaN(v)) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, '0');
    const d = String(v.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return todayLocalYYYYMMDD();
}

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactionsContext() || {};

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income'); // income | expense | other
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro'); // default
  const [date, setDate] = useState(todayLocalYYYYMMDD()); // use local YYYY-MM-DD
  const [error, setError] = useState('');

  const CATEGORY_OPTIONS = ['Alimentação', 'Transporte', 'Lazer', 'Salário', 'Moradia', 'Outros'];
  const PAYMENT_OPTIONS = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Pix', 'Transferência Bancária', 'Outro'];

  function validate() {
    if (!description.trim()) return 'Informe a descrição';
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) === 0) return 'Informe um valor válido';
    if (!category && !customCategory.trim()) return 'Informe a categoria';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');

    const finalCategory = customCategory.trim() || category || 'Outros';

    // SALVA somente a string YYYY-MM-DD (sem toISOString)
    const dateStr = toDateString(date);

    const tx = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(Number(amount).toFixed(2)),
      type,
      category: finalCategory,
      paymentMethod,
      date: dateStr,
    };

    const payload = {
      ...tx,
      amount: Number(tx.amount || 0),
      date: tx.date, // já YYYY-MM-DD
    };

    if (typeof addTransaction === 'function') {
      addTransaction(payload);
    } else {
      console.warn('addTransaction não encontrado no contexto. Transação:', payload);
    }

    navigate('/transacoes');
  }

  return (
    <div className="add-tx-page">
      <div className="add-tx-card">
        <header className="add-tx-header">
          <h2>Adicionar Transação</h2>
          <p className="muted">Preencha os detalhes da transação</p>
        </header>

        <form className="add-tx-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="form-error" role="alert">{error}</div>}

          <label className="field">
            <span className="label">Descrição</span>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Compra mercado" required />
          </label>

          <div className="row">
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Valor</span>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            </label>

            <label className="field" style={{ width: 160 }}>
              <span className="label">Tipo</span>
              <div className="select-wrapper">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                  <option value="other">Outra</option>
                </select>
              </div>
            </label>
          </div>

          <div className="row">
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Categoria</span>
              <div className="select-wrapper">
                <select value={category} onChange={(e) => { setCategory(e.target.value); setCustomCategory(''); }}>
                  <option value="">-- selecionar --</option>
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input className="tiny" type="text" value={customCategory} onChange={(e) => { setCustomCategory(e.target.value); setCategory(''); }} placeholder="ou crie uma nova categoria" />
            </label>

            <label className="field" style={{ width: 220 }}>
              <span className="label">Método de pagamento</span>
              <div className="select-wrapper">
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {PAYMENT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </label>
          </div>

          <label className="field">
            <span className="label">Data</span>
            <div className="select-wrapper">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </label>

          <div className="row between" style={{ marginTop: 12 }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar transação</button>
          </div>
        </form>
      </div>
    </div>
  );
}