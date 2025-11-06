import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useTransactions } from '../../hooks/useTransactions';
import '../../lib/chartSetup'; // garante registro (import único por módulo)

const BalanceChart = () => {
  const { transactions } = useTransactions();

  const { labels, dataset } = useMemo(() => {
    const grouped = transactions
      .slice()
      .reverse()
      .reduce((acc, t) => {
        const day = new Date(t.id).toLocaleDateString();
        acc[day] = (acc[day] || 0) + (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
        return acc;
      }, {});
    const labels = Object.keys(grouped);
    let cumulative = 0;
    const dataPoints = labels.map((l) => (cumulative += grouped[l]));
    return {
      labels,
      dataset: {
        label: 'Saldo acumulado',
        data: dataPoints,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.15)',
        fill: true,
        tension: 0.3,
      },
    };
  }, [transactions]);

  const data = { labels, datasets: [dataset] };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Evolução do Saldo' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Line data={data} options={options} redraw />;
};

export default BalanceChart;