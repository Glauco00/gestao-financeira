import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useTransactionsContext } from '../../context/TransactionsContext';

const COLORS = ['#16a34a', '#ef4444', '#06b6d4', '#f59e0b', '#7c3aed', '#ef7aa1'];

const currency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

function EmptyCard({ title, subtitle = 'Sem dados' }) {
  return (
    <div className="card" style={{ minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--muted)' }}>
      <h4 style={{ marginBottom: 6 }}>{title}</h4>
      <div style={{ fontSize: 14 }}>{subtitle}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ background: '#0f1113', color: 'var(--text)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, minWidth: 160 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 10, height: 10, background: p.color, display: 'inline-block', borderRadius: 3 }} />
            <strong style={{ fontSize: 13 }}>{p.name}</strong>
          </div>
          <div style={{ fontWeight: 700 }}>{currency(p.value)}</div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardCharts() {
  const { transactions } = useTransactionsContext();

  const { balanceSeries, monthlySeries, categorySeries } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { balanceSeries: [], monthlySeries: [], categorySeries: [] };
    }

    // Balance series (daily cumulative)
    const byDay = {};
    transactions
      .slice()
      .sort((a, b) => a.id - b.id)
      .forEach((t) => {
        const day = new Date(t.id).toLocaleDateString();
        const val = (t.type === 'income' ? 1 : -1) * Number(t.amount || 0);
        byDay[day] = (byDay[day] || 0) + val;
      });
    const days = Object.keys(byDay).sort((a, b) => new Date(a) - new Date(b));
    let cum = 0;
    const balanceSeries = days.map((d) => {
      cum += byDay[d];
      return { date: d, balance: Number(cum.toFixed(2)) };
    });

    // Monthly series (income / expense)
    const byMonth = {};
    transactions.forEach((t) => {
      const dt = new Date(t.id);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = byMonth[key] || { month: key, income: 0, expense: 0 };
      if (t.type === 'income') byMonth[key].income += Number(t.amount || 0);
      else byMonth[key].expense += Number(t.amount || 0);
    });
    const months = Object.values(byMonth)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        monthLabel: new Date(`${m.month}-01`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
        net: Number((m.income - m.expense).toFixed(2)),
      }));

    // Categories pie
    const byCat = {};
    transactions.forEach((t) => {
      const cat = t.category || (t.type === 'income' ? 'Entradas' : 'Outros');
      byCat[cat] = (byCat[cat] || 0) + Math.abs(Number(t.amount || 0));
    });
    const categorySeries = Object.keys(byCat).map((k, i) => ({ name: k, value: Number(byCat[k].toFixed(2)), color: COLORS[i % COLORS.length] }));

    return { balanceSeries, monthlySeries: months, categorySeries };
  }, [transactions]);

  // constants to keep uniform sizes and prevent cut
  const yAxisWidth = 88;
  const chartHeight = 220;

  // grid 2x2: Balance, Pie (moved), Monthly bars (moved), Fluxo (net)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      {/* Card 1: Evolução do Saldo */}
      {balanceSeries.length === 0 ? (
        <EmptyCard title="Evolução do Saldo" />
      ) : (
        <div className="card">
          <h4 style={{ marginBottom: 10 }}>Evolução do Saldo</h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={balanceSeries} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <YAxis width={yAxisWidth} tickFormatter={(v) => currency(v)} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="balance" stroke="#16a34a" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Card 2: Gastos por Categoria (moved to top-right) */}
      {categorySeries.length === 0 ? (
        <EmptyCard title="Gastos por Categoria" />
      ) : (
        <div className="card">
          <h4 style={{ marginBottom: 10 }}>Gastos por Categoria</h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie data={categorySeries} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={6} labelLine={false}>
                {categorySeries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categorySeries.map((c) => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ width: 10, height: 10, background: c.color, display: 'inline-block', borderRadius: 3 }} />
                  <span style={{ color: 'var(--muted)' }}>{c.name}</span>
                </div>
                <div style={{ fontWeight: 700 }}>{currency(c.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card 3: Entradas x Saídas (mensal) - moved to bottom-left */}
      {monthlySeries.length === 0 ? (
        <EmptyCard title="Entradas x Saídas (mensal)" />
      ) : (
        <div className="card">
          <h4 style={{ marginBottom: 10 }}>Entradas x Saídas (mensal)</h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={monthlySeries} margin={{ top: 6, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="monthLabel" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <YAxis width={yAxisWidth} tickFormatter={(v) => currency(v)} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ marginLeft: 48}} />
              <Bar dataKey="income" name="Entradas" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="expense" name="Saídas" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Card 4: Fluxo Líquido Mensal (bottom-right) */}
      {monthlySeries.length === 0 ? (
        <EmptyCard title="Fluxo Líquido Mensal" />
      ) : (
        <div className="card">
          <h4 style={{ marginBottom: 10 }}>Fluxo Líquido Mensal</h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={monthlySeries} margin={{ top: 6, right: 24, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="monthLabel" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <YAxis width={yAxisWidth} tickFormatter={(v) => currency(v)} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="net" stroke="#f59e0b" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}