import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsContext } from '../context/TransactionsContext';
import DashboardCharts from '../components/charts/DashboardCharts';

export default function Dashboard() {
  const { transactions, getBalance } = useTransactionsContext();
  const balance = getBalance();
  const navigate = useNavigate();

  const totalEntradas = transactions.reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : 0), 0);
  const totalDespesas = transactions.reduce((s, t) => s + (t.type === 'expense' ? Number(t.amount) : 0), 0);

  // limite de últimas transações exibidas
  const LAST_N = 6;
  const latest = transactions
    .slice()
    .sort((a, b) => {
      const ta = Number(a.id || a.createdAt || 0);
      const tb = Number(b.id || b.createdAt || 0);
      return tb - ta;
    })
    .slice(0, LAST_N);

  return (
    <>
      <h1>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18, alignItems: 'start' }}>
        <div>
          <div
            className="card"
            style={{
              marginBottom: 18,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>Saldo Atual</div>
              <div className="stat-value" style={{ fontSize: 26 }}>{`R$ ${Number(balance).toFixed(2)}`}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button
                className="btn-primary"
                onClick={() => navigate('/transacoes/adicionar')}
                style={{ padding: '8px 14px', borderRadius: 10 }}
              >
                Adicionar transação
              </button>
            </div>
          </div>

          <DashboardCharts />
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <h3>Resumo</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ color: 'var(--muted)' }}>Entradas</div>
              <div style={{ color: 'var(--accent)', fontWeight: 700 }}>R$ {Number(totalEntradas).toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ color: 'var(--muted)' }}>Saídas</div>
              <div style={{ color: 'var(--danger)', fontWeight: 700 }}>R$ {Number(totalDespesas).toFixed(2)}</div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.04)', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ color: 'var(--muted)' }}>Saldo</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: balance >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                R$ {Number(balance).toFixed(2)}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="btn-primary"
                onClick={() => navigate('/transacoes/adicionar')}
                style={{ padding: '8px 12px', borderRadius: 10, width: '100%' }}
              >
                Adicionar transação
              </button>
            </div>
          </div>

          {/* Lista de transações (embaixo do resumo) - agora ocupa o espaço restante e tem padding interno */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 180, flex: 1 }}>
            <h3 style={{ marginBottom: -5 }}>Últimas {LAST_N} transações</h3>

            {/* área rolável com padding interno */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px 4px 6px' }}>
              {latest.length === 0 ? (
                <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhuma transação encontrada.</p>
              ) : (
                <div className="transactions">
                  {latest.map((t, idx) => (
                    <div
                      key={(t.id || idx) + Math.random()}
                      className="tx"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 6px',
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block' }}>{t.description || (t.type === 'income' ? 'Entrada' : 'Saída')}</strong>
                        <div className="meta" style={{ marginTop: 4 }}>{new Date(t.id || t.createdAt || Date.now()).toLocaleString()}</div>
                        {t.category && <div className="meta" style={{ fontSize: 12 }}>{t.category}</div>}
                      </div>
                      <div className={`amount ${t.type === 'income' ? 'positive' : 'negative'}`} style={{ marginLeft: 12 }}>
                        R$ {Number(t.amount || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* rodapé do card com o botão, sempre visível */}
            {transactions.length > LAST_N && (
              <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.02)', marginTop: 6, textAlign: 'center' }}>
                <button className="btn-primary" onClick={() => navigate('/transacoes')} style={{ padding: '6px 10px', borderRadius: 8 }}>
                  Ver todas ({transactions.length})
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}