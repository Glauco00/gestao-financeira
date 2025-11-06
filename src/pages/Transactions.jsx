import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import './AddTransaction.css'; // reutiliza estilos do formulário

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));
}

export default function Transactions() {
  const navigate = useNavigate();
  const ctx = useTransactionsContext() || {};
  const { transactions = [], addTransaction, updateTransaction, removeTransaction, deleteTransaction } = ctx;

  // fallback names
  const doDelete = removeTransaction || deleteTransaction;
  const doUpdate = updateTransaction;

  // ordena do mais recente para o mais antigo (assume id timestamp)
  const sorted = useMemo(() => {
    return (transactions || []).slice().sort((a, b) => {
      const ta = Number(a.id || a.createdAt || 0);
      const tb = Number(b.id || b.createdAt || 0);
      return tb - ta;
    });
  }, [transactions]);

  // edição modal
  const [editing, setEditing] = useState(null); // objeto tx em edição
  const [saving, setSaving] = useState(false);

  function handleDelete(id) {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    if (typeof doDelete === 'function') {
      doDelete(id);
    } else {
      console.warn('Função de remoção não encontrada no contexto. id:', id);
    }
  }

  function openEdit(tx) {
    // prepara campos usados no form
    setEditing({
      ...tx,
      date: (tx.date || tx.id) ? new Date(tx.date || tx.id).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
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
      amount: Number(editing.amount),
      date: new Date(editing.date).toISOString(),
    };
    if (typeof doUpdate === 'function') {
      doUpdate(updated);
    } else {
      console.warn('Função de update não encontrada no contexto. Transação atualizada (local):', updated);
    }
    setSaving(false);
    setEditing(null);
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1>Transações</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" onClick={() => navigate('/transacoes/adicionar')}>Adicionar</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
        <div className="card">
          <h3 style={{ marginBottom: 10 }}>Todas as transações ({sorted.length})</h3>

          {sorted.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Nenhuma transação cadastrada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sorted.map((t) => (
                <div key={t.id} className="tx" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: 8, background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 8, height: 34, borderRadius: 6, background: t.type === 'income' ? '#16a34a' : '#ef4444' }} />
                    <div>
                      <strong style={{ display: 'block' }}>{t.description || (t.type === 'income' ? 'Entrada' : 'Saída')}</strong>
                      <div className="meta" style={{ color: 'var(--muted)', fontSize: 13 }}>{t.category || '—'} • {new Date(t.date || t.id || t.createdAt || Date.now()).toLocaleDateString()}</div>
                      {t.paymentMethod && <div className="meta" style={{ color: 'var(--muted)', fontSize: 12 }}>{t.paymentMethod}</div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
      </div>

      {/* Modal de edição simples */}
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