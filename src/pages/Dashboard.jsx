import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import DashboardCharts from '../components/charts/DashboardCharts';
import { TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { transactions, getBalance } = useTransactionsContext();
  const balance = getBalance();
  const navigate = useNavigate();

  const totalEntradas = transactions.reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : 0), 0);
  const totalDespesas = transactions.reduce((s, t) => s + (t.type === 'expense' ? Number(t.amount) : 0), 0);

  const LAST_N = 5;
  const latest = transactions
    .slice()
    .sort((a, b) => {
      const ta = Number(a.id || a.createdAt || 0);
      const tb = Number(b.id || b.createdAt || 0);
      return tb - ta;
    })
    .slice(0, LAST_N);

  return (
    <div className="dashboard-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Dashboard</h1>
        <button className="btn-primary" onClick={() => navigate('/transacoes/adicionar')}>
          <Plus size={18} /> Nova Transação
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Hero Card */}
          <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(24,24,27,0.8) 100%)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="stat-label" style={{ color: 'var(--text)', opacity: 0.8 }}>Saldo Total</div>
                <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: 4 }}>
                  {`R$ ${Number(balance).toFixed(2)}`}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px 16px' }}>
            <h3 style={{ marginLeft: 8, marginBottom: 16 }}>Visão Geral</h3>
            <DashboardCharts />
          </div>
        </div>

        <aside className="dashboard-side" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Resumo Card */}
          <div className="card summary-card">
            <h3 style={{ marginBottom: 16 }}>Resumo do Mês</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'rgba(16,185,129,0.1)', padding: 8, borderRadius: 10, color: 'var(--accent)' }}>
                  <TrendingUp size={18} />
                </div>
                <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Entradas</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>R$ {Number(totalEntradas).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'rgba(239,68,68,0.1)', padding: 8, borderRadius: 10, color: 'var(--danger)' }}>
                  <TrendingDown size={18} />
                </div>
                <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Saídas</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--danger)' }}>R$ {Number(totalDespesas).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Saldo Líquido</span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: balance >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                R$ {Number(balance).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Últimas Transações */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Histórico Recente</h3>
              <button 
                onClick={() => navigate('/transacoes')} 
                className="btn-icon" 
                style={{ border: 'none', background: 'transparent' }}
                title="Ver todas"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="transactions" style={{ flex: 1 }}>
              {latest.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)' }}>
                  <p>Nenhuma transação ainda.</p>
                </div>
              ) : (
                latest.map((t, idx) => (
                  <div key={(t.id || idx) + Math.random()} className="tx">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                       <div style={{ 
                         background: t.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                         color: t.type === 'income' ? 'var(--accent)' : 'var(--danger)',
                         padding: 10, 
                         borderRadius: 10 
                       }}>
                         {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                       </div>
                       <div>
                         <strong className="title">{t.description || (t.type === 'income' ? 'Entrada' : 'Saída')}</strong>
                         {t.category && <div className="meta" style={{ marginTop: 2 }}>{t.category}</div>}
                       </div>
                    </div>
                    <div className={`amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                      {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount || 0).toFixed(2)}
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