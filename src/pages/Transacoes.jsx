import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import './AddTransaction.css';

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));
}

// converte safely "YYYY-MM-DD" para display sem shift de fuso
function formatDisplayDate(dateVal) {
  if (!dateVal) return '';
  const s = String(dateVal);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString();
  }
  const parsed = new Date(s);
  if (!isNaN(parsed)) return parsed.toLocaleDateString();
  return s;
}

export default function Transactions() {
  const navigate = useNavigate();
  const ctx = useTransactionsContext() || {};
  const {
    transactions = [],
    addTransaction,
    removeTransaction,
    updateTransaction,
  } = ctx;

  console.debug('Transactions page context:', { transactions, addTransaction, removeTransaction, updateTransaction });

  const sorted = useMemo(() => {
    return (transactions || []).slice().sort((a, b) => {
      const ta = Number(a.id || a.createdAt || 0);
      const tb = Number(b.id || b.createdAt || 0);
      return tb - ta;
    });
  }, [transactions]);

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleDelete(id) {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    if (typeof removeTransaction === 'function') {
      removeTransaction(id);
    } else {
      console.warn('removeTransaction não disponível no contexto. id:', id);
    }
  }

  function openEdit(tx) {
    // preferir manter a parte 'YYYY-MM-DD' se já existir na string,
    // evita parse que gera shift de fuso
    let dateValue = '';
    if (tx && tx.date && typeof tx.date === 'string' && tx.date.length >= 10) {
      dateValue = tx.date.slice(0, 10);
    } else if (tx && (tx.id || tx.createdAt)) {
      const dt = new Date(tx.date || tx.id || tx.createdAt);
      if (!isNaN(dt)) {
        // gerar YYYY-MM-DD local as fallback
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        dateValue = `${y}-${m}-${d}`;
      } else {
        dateValue = new Date().toISOString().slice(0, 10);
      }
    } else {
      dateValue = new Date().toISOString().slice(0, 10);
    }

    setEditing({
      ...tx,
      date: dateValue,
    });
  }

  function handleEditChange(field, value) {
    setEditing((s) => ({ ...s, [field]: value }));
  }

  async function handleSaveEdit(e) {
    e && e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const updated = {
      ...editing,
      amount: Number(editing.amount || 0),
      // SALVAR apenas 'YYYY-MM-DD' (string) para evitar deslocamento de fuso
      date: editing.date, // não usar new Date(...).toISOString()
    };
    if (typeof updateTransaction === 'function') {
      updateTransaction(updated);
    } else {
      console.warn('updateTransaction não disponível no contexto. Transação atualizada localmente:', updated);
    }
    setSaving(false);
    setEditing(null);
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1>Transações</h1>
        <div>
          <button className="btn-primary" onClick={() => navigate('/transacoes/adicionar')}>Adicionar</button>
        </div>
      </div>

      <div className="card">
        <h3>Todas as transações ({sorted.length})</h3>

        {sorted.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>
            Nenhuma transação encontrada.
            <br />
            (Verifique no console se o contexto retorna "transactions")
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sorted.map((t) => (
              <div key={t.id || Math.random()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 8, height: 34, borderRadius: 6, background: t.type === 'income' ? '#16a34a' : '#ef4444' }} />
                  <div>
                    <strong style={{ display: 'block' }}>{t.description || (t.type === 'income' ? 'Entrada' : 'Saída')}</strong>
                    <div className="meta" style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {t.category || '—'} • {t.date ? formatDisplayDate(t.date) : new Date(t.id || t.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    {t.paymentMethod && <div className="meta" style={{ color: 'var(--muted)', fontSize: 12 }}>{t.paymentMethod}</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontWeight: 800, minWidth: 110, textAlign: 'right', color: t.type === 'income' ? 'var(--accent)' : 'var(--danger)' }}>
                    {formatCurrency(t.amount)}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" onClick={() => openEdit(t)} style={{ padding: '6px 8px' }}>Editar</button>
                    <button className="btn-secondary" onClick={() => handleDelete(t.id)} style={{ padding: '6px 8px', borderColor: 'rgba(239,68,68,0.14)', color: 'var(--danger)' }}>Excluir</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edição */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', zIndex: 1200,
        }}>
          <form onSubmit={handleSaveEdit} style={{ width: 720, maxWidth: '95%', background: 'var(--surface)', borderRadius: 12, padding: 18, border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Editar transação</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Fechar</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <label className="field">
                <span className="label">Descrição</span>
                <input type="text" value={editing.description || ''} onChange={(e) => handleEditChange('description', e.target.value)} />
              </label>

              <div style={{ display: 'flex', gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">Valor</span>
                  <input type="number" step="0.01" value={editing.amount || ''} onChange={(e) => handleEditChange('amount', e.target.value)} />
                </label>

                <label className="field" style={{ width: 160 }}>
                  <span className="label">Tipo</span>
                  <div className="select-wrapper">
                    <select value={editing.type} onChange={(e) => handleEditChange('type', e.target.value)}>
                      <option value="income">Entrada</option>
                      <option value="expense">Saída</option>
                      <option value="other">Outra</option>
                    </select>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">Categoria</span>
                  <div className="select-wrapper">
                    <select value={editing.category || ''} onChange={(e) => handleEditChange('category', e.target.value)}>
                      <option value="">-- selecionar --</option>
                      <option>Alimentação</option>
                      <option>Transporte</option>
                      <option>Lazer</option>
                      <option>Salário</option>
                      <option>Moradia</option>
                      <option>Outros</option>
                    </select>
                  </div>
                </label>

                <label className="field" style={{ width: 220 }}>
                  <span className="label">Método de pagamento</span>
                  <div className="select-wrapper">
                    <select value={editing.paymentMethod || ''} onChange={(e) => handleEditChange('paymentMethod', e.target.value)}>
                      <option>Dinheiro</option>
                      <option>Cartão de crédito</option>
                      <option>Cartão de débito</option>
                      <option>Pix</option>
                      <option>Transferência Bancária</option>
                      <option>Outro</option>
                    </select>
                  </div>
                </label>
              </div>

              <label className="field">
                <span className="label">Data</span>
                <div className="select-wrapper">
                  <input type="date" value={editing.date || new Date().toISOString().slice(0, 10)} onChange={(e) => handleEditChange('date', e.target.value)} />
                </div>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}