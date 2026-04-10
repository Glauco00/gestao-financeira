import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import { useAuth } from '../context/AuthContext';
import DashboardCharts from '../components/charts/DashboardCharts';
import { TrendingUp, TrendingDown, Plus, ArrowRight, Wallet, Clock, Loader2 } from 'lucide-react';
import './Dashboard.css';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

export default function Dashboard() {
  const { transactions, loading, getBalance, refresh } = useTransactionsContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  // O carregamento inicial já é tratado pelo hook useTransactions no TransactionsContext

  const balance = getBalance();
  const totalEntradas = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalDespesas = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

  const latest = [...transactions]
    .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
    .slice(0, 5);

  if (loading && transactions.length === 0) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={48} />
        <p>Carregando seus dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="welcome">
          <h1>Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋</h1>
          <p className="muted">Aqui está o que aconteceu com suas finanças hoje.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/transacoes/adicionar')}>
          <Plus size={18} /> Nova Transação
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Main Card */}
          <div className="card hero-card glass-card">
            <div className="card-content">
              <div className="info">
                <span className="label">Saldo Total Disponível</span>
                <h2 className="balance-value">{formatCurrency(balance)}</h2>
              </div>
              <div className="card-icon">
                <Wallet size={32} />
              </div>
            </div>
            <div className="card-footer">
              <div className="mini-stat">
                <div className="dot positive"></div>
                <span>Você economizou 12% a mais este mês</span>
              </div>
            </div>
          </div>

          <div className="charts-section card glass-card">
            <div className="card-header">
              <h3>Visão Semanal</h3>
              <select className="select-tiny">
                <option>Últimos 7 dias</option>
                <option>Último mês</option>
              </select>
            </div>
            <div className="chart-container">
              <DashboardCharts />
            </div>
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="card glass-card summary-card">
            <h3>Resumo Mensal</h3>
            <div className="stat-row">
              <div className="stat-info">
                <div className="icon-box positive">
                  <TrendingUp size={18} />
                </div>
                <div className="text">
                  <span className="label">Receitas</span>
                  <span className="value positive">{formatCurrency(totalEntradas)}</span>
                </div>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-info">
                <div className="icon-box negative">
                  <TrendingDown size={18} />
                </div>
                <div className="text">
                  <span className="label">Despesas</span>
                  <span className="value negative">{formatCurrency(totalDespesas)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card history-card">
            <div className="card-header">
              <h3>Atividade Recente</h3>
              <button className="btn-ghost-icon" onClick={() => navigate('/relatorios')}>
                <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="tx-list">
              {latest.length === 0 ? (
                <div className="empty-state">
                  <Clock size={32} className="muted" />
                  <p>Nenhuma atividade recente encontrada.</p>
                </div>
              ) : (
                latest.map((t) => (
                  <div key={t.id} className="tx-item">
                    <div className="tx-icon">
                      {t.category_icon || (t.type === 'income' ? '💰' : '💸')}
                    </div>
                    <div className="tx-info">
                      <span className="title" title={t.description}>{t.description}</span>
                      <span className="meta">{t.category_name}</span>
                    </div>
                    <div className={`amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}