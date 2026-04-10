import React, { useEffect, useState, useMemo } from 'react';
import { FileDown, FileText, RefreshCw, Search, Calendar, Filter } from 'lucide-react';
import { useTransactionsContext } from '../context/TransactionsContext';
import * as api from '../services/api';
import { generateFinancePDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import './Relatorios.css';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

export default function Relatorios() {
  const { transactions, loading, refresh } = useTransactionsContext();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    type: '',
    categoryId: ''
  });
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await api.fetchCategories();
        if (catRes.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Erro ao carregar dados do relatório:', err);
      }
    }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    let list = [...transactions];
    
    // Filtros de data
    if (filters.startDate) {
      list = list.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      list = list.filter(t => t.date <= filters.endDate);
    }
    // Filtro de tipo
    if (filters.type) {
      list = list.filter(t => t.type === filters.type);
    }
    // Filtro de categoria
    if (filters.categoryId) {
      list = list.filter(t => t.category_id === parseInt(filters.categoryId));
    }
    // Busca textual
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => (t.description || '').toLowerCase().includes(q) || (t.category_name || '').toLowerCase().includes(q));
    }
    
    return list;
  }, [transactions, filters, search]);

  const stats = useMemo(() => {
    const income = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    return { income, expense, balance: income - expense };
  }, [filtered]);

  function handleExportCSV() {
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
    const rows = filtered.map(t => [
      t.date,
      `"${t.description || ''}"`,
      `"${t.category_name || ''}"`,
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.amount
    ]);
    
    const content = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  function handleExportPDF() {
    generateFinancePDF({
      transactions: filtered,
      summary: stats,
      period: `${new Date(filters.startDate).toLocaleDateString()} - ${new Date(filters.endDate).toLocaleDateString()}`,
      userName: user?.name
    });
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Relatórios Detalhados</h1>
        <p className="muted">Analise seu fluxo de caixa e exporte dados para controle externo.</p>
      </div>

      <div className="report-controls glass-card">
        <div className="filters-grid">
          <div className="filter-item">
            <label><Calendar size={14} /> Início</label>
            <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
          </div>
          <div className="filter-item">
            <label><Calendar size={14} /> Fim</label>
            <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
          </div>
          <div className="filter-item">
            <label><Filter size={14} /> Tipo</label>
            <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
              <option value="">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
          <div className="filter-item">
            <label><Filter size={14} /> Categoria</label>
            <select value={filters.categoryId} onChange={e => setFilters({...filters, categoryId: e.target.value})}>
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="search-and-actions">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por descrição..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="actions-group">
            <button className="btn-outline" onClick={refresh} title="Atualizar">
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
            <button className="btn-secondary" onClick={handleExportCSV} disabled={filtered.length === 0} title="Exportar CSV">
              <FileDown size={18} /> CSV
            </button>
            <button className="btn-primary" onClick={handleExportPDF} disabled={filtered.length === 0}>
              <FileText size={18} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="summary-row">
        <div className="card stat-card glass-card">
          <span className="label">Total de Receitas</span>
          <span className="value positive">{formatCurrency(stats.income)}</span>
        </div>
        <div className="card stat-card glass-card">
          <span className="label">Total de Despesas</span>
          <span className="value negative">{formatCurrency(stats.expense)}</span>
        </div>
        <div className="card stat-card glass-card primary">
          <span className="label">Balanço Líquido</span>
          <span className="value">{formatCurrency(stats.balance)}</span>
        </div>
      </div>

      <div className="card report-table-card glass-card">
        <h3>Transações Filtradas ({filtered.length})</h3>
        <div className="table-responsive">
          <table className="report-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center muted">Nenhum dado encontrado para os filtros selecionados.</td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id}>
                    <td className="date-cell">{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.description}</td>
                    <td>
                      <span className="category-badge">
                        {t.category_icon} {t.category_name}
                      </span>
                    </td>
                    <td className={`text-right amount-cell ${t.type === 'income' ? 'positive' : 'negative'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
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