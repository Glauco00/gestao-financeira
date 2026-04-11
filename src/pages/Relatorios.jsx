import React, { useEffect, useState, useMemo } from 'react';
import { FileDown, FileText, RefreshCw, Search, Calendar, Filter, PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTransactionsContext } from '../context/TransactionsContext';
import * as api from '../services/api';
import { generateFinancePDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import './Relatorios.css';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'];

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
    if (filters.startDate) list = list.filter(t => t.date >= filters.startDate);
    if (filters.endDate) list = list.filter(t => t.date <= filters.endDate);
    if (filters.type) list = list.filter(t => t.type === filters.type);
    if (filters.categoryId) list = list.filter(t => t.category_id === parseInt(filters.categoryId));
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

  const chartData = useMemo(() => {
    const categoryTotals = {};
    filtered.filter(t => t.type === 'expense').forEach(t => {
      const name = t.category_name || 'Sem Categoria';
      categoryTotals[name] = (categoryTotals[name] || 0) + Number(t.amount);
    });
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  function handleExportCSV() {
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
    const rows = filtered.map(t => [t.date, `"${t.description || ''}"`, `"${t.category_name || ''}"`, t.type === 'income' ? 'Receita' : 'Despesa', t.amount]);
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
    <div className="reports-page animate-in">
      <header className="page-header">
        <div>
          <h1>Relatórios Detalhados</h1>
          <p className="muted">Análise profunda da sua saúde financeira.</p>
        </div>
        <div className="header-actions">
           <button className="btn-icon-round" onClick={refresh} title="Atualizar dados">
              <RefreshCw size={20} className={loading ? 'spin' : ''} />
           </button>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="card metric-card glass-card">
          <div className="metric-icon income"><ArrowUpRight size={24} /></div>
          <div className="metric-info">
            <span className="label">Receita no Período</span>
            <span className="value positive">{formatCurrency(stats.income)}</span>
          </div>
        </div>
        <div className="card metric-card glass-card">
          <div className="metric-icon expense"><ArrowDownRight size={24} /></div>
          <div className="metric-info">
            <span className="label">Despesa no Período</span>
            <span className="value negative">{formatCurrency(stats.expense)}</span>
          </div>
        </div>
        <div className="card metric-card glass-card highlight">
          <div className="metric-icon balance"><Activity size={24} /></div>
          <div className="metric-info">
            <span className="label">Balanço Disponível</span>
            <span className="value">{formatCurrency(stats.balance)}</span>
          </div>
        </div>
      </section>

      <div className="analytics-toolbar glass-card">
        <div className="toolbar-section filters">
          <div className="filter-group">
            <Calendar size={16} />
            <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
            <span>até</span>
            <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
          </div>
          <div className="v-divider"></div>
          <select className="minimal-select" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
            <option value="">Todos os Tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          <select className="minimal-select" value={filters.categoryId} onChange={e => setFilters({...filters, categoryId: e.target.value})}>
            <option value="">Todas Categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div className="toolbar-divider"></div>

        <div className="toolbar-section search-actions">
          <div className="premium-search">
            <Search size={18} />
            <input type="text" placeholder="Filtrar por descrição..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="export-actions">
            <button className="btn-ghost" onClick={handleExportCSV} disabled={filtered.length === 0}><FileDown size={18} /> CSV</button>
            <button className="btn-primary" onClick={handleExportPDF} disabled={filtered.length === 0}><FileText size={18} /> Exportar PDF</button>
          </div>
        </div>
      </div>

      <main className="main-content-grid">
        <div className="card table-container glass-card">
          <div className="card-header-row">
            <h3>Lista de Movimentações</h3>
            <span className="badge">{filtered.length} itens</span>
          </div>
          <div className="table-responsive">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Atividade</th>
                  <th>Categoria</th>
                  <th className="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-row text-center">
                      <Search size={48} className="muted-icon" />
                      <p>Nenhum resultado para estes filtros.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(t => (
                    <tr key={t.id} className="table-row-hover">
                      <td className="date-cell">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="desc-cell">{t.description}</td>
                      <td>
                        <span className="cat-tag">
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

        <div className="card chart-container glass-card">
          <div className="card-header-row">
            <h3>Distribuição de Gastos</h3>
            <PieIcon size={18} className="muted" />
          </div>
          <div className="chart-box">
             {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      formatter={(v) => formatCurrency(v)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="empty-chart">
                   <Activity size={32} />
                   <p>Aguardando dados...</p>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}