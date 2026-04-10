import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import { Trash2, Edit2, Plus, Search, Calendar, Tag } from 'lucide-react';
import './AddTransaction.css'; // Reutilizando alguns estilos base
import './Relatorios.css'; // Reutilizando estilos de tabela

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

export default function Transactions() {
  const navigate = useNavigate();
  const { transactions, removeTransaction, loading } = useTransactionsContext();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return transactions
      .filter(t => (t.description || '').toLowerCase().includes(search.toLowerCase()) || (t.category_name || '').toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search]);

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta transação permanentemente?')) return;
    try {
      await removeTransaction(id);
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  }

  return (
    <div className="reports-page"> {/* Usando container de relatórios para manter padrão */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Minhas Transações</h1>
          <p className="muted">Histórico completo de toda sua atividade financeira.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/transacoes/adicionar')}>
          <Plus size={18} /> Nova Transação
        </button>
      </div>

      <div className="report-controls glass-card" style={{ marginBottom: 24 }}>
        <div className="search-wrapper" style={{ width: '100%', maxWidth: 'none' }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por descrição, categoria ou valor..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="card report-table-card glass-card">
        <div className="table-responsive">
          <table className="report-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th className="text-right">Valor</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center">Carregando transações...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center muted">Nenhuma transação encontrada.</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="date-cell">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={14} className="muted" />
                        {new Date(t.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.description}</td>
                    <td>
                      <span className="category-badge">
                        {t.category_icon || <Tag size={12} />} {t.category_name}
                      </span>
                    </td>
                    <td className={`text-right amount-cell ${t.type === 'income' ? 'positive' : 'negative'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => navigate(`/transacoes/editar/${t.id}`)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon danger" onClick={() => handleDelete(t.id)} title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}