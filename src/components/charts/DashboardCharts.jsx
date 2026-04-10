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
  LineChart,
  Line,
  ReferenceArea,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useTransactionsContext } from '../../context/TransactionsContext';

const currency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));

function EmptyCard({ title, subtitle = 'Sem dados' }) {
  return (
    <div
      className="card"
      style={{
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--muted)',
      }}
    >
      <h4 style={{ marginBottom: 6 }}>{title}</h4>
      <div style={{ fontSize: 14 }}>{subtitle}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: '#0f1113',
        color: 'var(--text)',
        padding: 10,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
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
  const { transactions = [] } = useTransactionsContext() || {};

  const { balanceSeries, monthlySeries, categorySeries } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { balanceSeries: [], monthlySeries: [], categorySeries: [] };
    }

    // Balance series (daily cumulative)
    const byDay = {};
    transactions
      .slice()
      .sort((a, b) => new Date(a.date || a.id || a.createdAt) - new Date(b.date || b.id || b.createdAt))
      .forEach((t) => {
        const day = new Date(t.date || t.id || t.createdAt).toLocaleDateString();
        const val = (t.type === 'income' ? 1 : -1) * Number(t.amount || 0);
        byDay[day] = (byDay[day] || 0) + val;
      });

    const days = Object.keys(byDay).sort((a, b) => new Date(a) - new Date(b));
    let cum = 0;
    const balanceSeriesLocal = days.map((d) => {
      cum += byDay[d];
      return { date: d, balance: Number(cum.toFixed(2)) };
    });

    // Monthly series (income / expense)
    const byMonth = {};
    transactions.forEach((t) => {
      const dt = new Date(t.date || t.id || t.createdAt);
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
      const signed = (t.type === 'income' ? 1 : -1) * Number(t.amount || 0);
      const abs = Math.abs(Number(t.amount || 0));
      if (!byCat[cat]) byCat[cat] = { totalAbs: 0, totalSigned: 0 };
      byCat[cat].totalAbs += abs;
      byCat[cat].totalSigned += signed;
    });

    const categorySeriesLocal = Object.keys(byCat).map((k) => {
      const entry = byCat[k];
      const name = k;
      const value = Number(entry.totalAbs.toFixed(2));
      // Priorizar a cor da categoria vinda do banco se disponível, caso contrário usar padrão por tipo
      const catObj = transactions.find(t => t.category_name === k);
      const color = catObj?.category_color || (entry.totalSigned > 0 ? '#10b981' : '#ef4444');
      return { name, value, color };
    });

    return {
      balanceSeries: balanceSeriesLocal,
      monthlySeries: months,
      categorySeries: categorySeriesLocal,
    };
  }, [transactions]);

  const yAxisWidth = 88;
  const chartHeight = 220;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      {/* Evolução do Saldo */}
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

      {/* Gastos por Categoria */}
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

      {/* Entradas x Saídas (mensal) */}
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
              <Legend verticalAlign="top" height={30} wrapperStyle={{ marginLeft: 48 }} />
              <Bar dataKey="income" name="Entradas" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="expense" name="Saídas" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Fluxo Líquido Mensal - Multi-line com faixas verticais alternadas */}
      {monthlySeries.length === 0 ? (
        <EmptyCard title="Fluxo Líquido Mensal" />
      ) : (
        <div className="card">
          <h4 style={{ marginBottom: 10 }}>Fluxo Líquido Mensal</h4>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={monthlySeries} margin={{ top: 6, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="monthLabel" type="category" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <YAxis width={yAxisWidth} tickFormatter={(v) => currency(v)} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ marginLeft: 48 }} />

              {/* faixas verticais alternadas */}
              {monthlySeries.map((m, i) => {
                if (i % 2 === 1) return null;
                const x1 = monthlySeries[i].monthLabel;
                const x2 = monthlySeries[i + 1] ? monthlySeries[i + 1].monthLabel : monthlySeries[i].monthLabel;
                return <ReferenceArea key={`ra-${i}`} x1={x1} x2={x2} strokeOpacity={0} fill="rgba(255,255,255,0.03)" />;
              })}

              <Line type="monotone" dataKey="income" name="Entradas" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="expense" name="Saídas" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="net" name="Fluxo líquido" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}