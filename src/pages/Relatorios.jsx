import React, { useEffect, useMemo, useState } from 'react';
import './Relatorios.css';

function loadTx() {
  try { const raw = localStorage.getItem('transactions'); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));
}

/* parseAmount: robusto para diferentes formatos e sinais (inclui sinais Unicode) */
function parseAmount(raw) {
  if (raw == null) return 0;
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw;

  let s = String(raw).trim();

  // normaliza sinais de menos (ASCII + Unicode variants)
  s = s.replace(/[\u2012\u2013\u2014\u2212]/g, '-');
  // remover espaços finos / NBSP
  s = s.replace(/\u00A0/g, ' ').trim();

  // detectar negativo por parênteses ou sinal de menos
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1).trim();
  }
  if (/^-/.test(s)) {
    negative = true;
    s = s.replace(/^-+/, '').trim();
  }

  // manter apenas dígitos, pontos e vírgulas
  s = s.replace(/[^\d.,]/g, '');

  const lastDot = s.lastIndexOf('.');
  const lastComma = s.lastIndexOf(',');

  if (lastComma > lastDot) {
    // formato BR: 1.234,56 -> 1234.56
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    // formato EN: 1,234.56 -> 1234.56
    s = s.replace(/,/g, '');
  } else {
    // sem separadores distintos: remover todos separadores e parse
    s = s.replace(/[.,]/g, '');
  }

  const num = parseFloat(s || '0');
  if (Number.isNaN(num)) return 0;
  return negative ? -Math.abs(num) : num;
}

/* detecta informação de tipo que indica despesa/entrada */
function txIndicatesExpense(tx) {
  const candidates = [
    tx?.type, tx?.kind, tx?.direction, tx?.transactionType, tx?.side
  ].filter(Boolean).map(v => String(v).toLowerCase());

  for (const v of candidates) {
    if (/(debit|expense|out|negative|sa[ií]da|despesa|pagamento)/.test(v)) return true;
    if (/(credit|income|in|positive|entrada|receita|recebimento)/.test(v)) return false;
  }

  // fallback: no information
  return null;
}

/* getAmount: prefere amountNumeric, usa parseAmount como fallback e aplica type se necessário */
function getAmount(tx) {
  if (!tx) return 0;

  // primeiro ver se o tipo (expense/income) está presente — usamos isso para ajustar o sinal
  const typeFlag = txIndicatesExpense(tx);

  // 1) campo numérico explícito — ajustar sinal conforme typeFlag
  if (typeof tx.amountNumeric === 'number' && !Number.isNaN(tx.amountNumeric)) {
    let n = tx.amountNumeric;
    if (typeFlag === true && n > 0) n = -Math.abs(n);
    if (typeFlag === false && n < 0) n = Math.abs(n);
    return n;
  }
  if (typeof tx.value === 'number' && !Number.isNaN(tx.value)) {
    let n = tx.value;
    if (typeFlag === true && n > 0) n = -Math.abs(n);
    if (typeFlag === false && n < 0) n = Math.abs(n);
    return n;
  }
  if (typeof tx.amount === 'number' && !Number.isNaN(tx.amount)) {
    let n = tx.amount;
    if (typeFlag === true && n > 0) n = -Math.abs(n);
    if (typeFlag === false && n < 0) n = Math.abs(n);
    return n;
  }

  // 2) parse de string / fallback
  const raw = tx.amount ?? tx.value ?? tx.raw ?? tx.price ?? '0';
  let n = parseAmount(raw);

  // 3) aplicar sinal se typeFlag indicar despesa/entrada (fallback)
  if (typeFlag === true && n > 0) n = -Math.abs(n);
  if (typeFlag === false && n < 0) n = Math.abs(n);

  return n;
}

function csvDownload(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Relatorios() {
  const [transactions, setTransactions] = useState(() => loadTx());
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(6);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setTransactions(loadTx());
  }, []);

  const categories = useMemo(() => {
    const c = new Set(transactions.map(t => t.category || '—'));
    return ['Todos', ...Array.from(c)];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const date = t?.date ? new Date(t.date) : (t?.createdAt ? new Date(t.createdAt) : null);
      if (from && date && date < new Date(from)) return false;
      if (to && date && date > new Date(to + 'T23:59:59')) return false;
      if (category && category !== 'Todos' && t.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        const txt = `${t.title||t.description||''} ${t.category||''}`.toLowerCase();
        if (!txt.includes(q)) return false;
      }
      return true;
    });
  }, [transactions, from, to, category, search]);

  // sumarização usando getAmount
  const summary = useMemo(() => {
    const amounts = filtered.map(t => getAmount(t));
    const inc = amounts.filter(n => n > 0).reduce((s, n) => s + n, 0);
    const exp = amounts.filter(n => n < 0).reduce((s, n) => s + Math.abs(n), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  function handleRefresh() {
    setTransactions(loadTx());
  }

  function handleExportCSV() {
    if (!filtered.length) return;
    const headers = ['id','title','amount_original','amount_numeric','date','category','notes'];
    const rows = filtered.map(t => {
      const numeric = getAmount(t);
      const vals = [
        t.id ?? '',
        `"${(t.title||t.description||'').replace(/"/g,'""')}"`,
        `"${String(t.amount ?? t.value ?? '')}"`,
        numeric.toFixed(2),
        t.date || t.createdAt || '',
        `"${(t.category||'').replace(/"/g,'""')}"`,
        `"${(t.notes||'').replace(/"/g,'""')}"`
      ];
      return vals.join(',');
    });
    csvDownload(`relatorios_transactions_${new Date().toISOString().slice(0,10)}.csv`, headers.join(',') + '\n' + rows.join('\n'));
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Relatórios</h1>
        <p className="muted">Resumo, filtros e exportação dos seus dados financeiros.</p>
      </div>

      <div className="report-controls">
        <div className="filters">
          <label>
            De
            <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} />
          </label>
          <label>
            Até
            <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} />
          </label>
          <label>
            Categoria
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
              {categories.map(c => <option key={c} value={c === 'Todos' ? '' : c}>{c}</option>)}
            </select>
          </label>

          <label className="search">
            Buscar
            <input className="search-input" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Título ou categoria" />
          </label>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={handleRefresh}>Atualizar</button>
          <button className="btn-primary" onClick={handleExportCSV} disabled={!filtered.length}>Exportar CSV</button>
        </div>
      </div>

      <div className="card-grid reports-grid">
        <div className="summary-cards">
          <div className="card stat-card">
            <div className="stat-label">Entradas</div>
            <div className="stat-value positive">{formatCurrency(summary.income)}</div>
            <div className="stat-sub muted">{filtered.filter(t => getAmount(t) > 0).length} lançamentos</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Saídas</div>
            <div className="stat-value negative">{formatCurrency(summary.expense)}</div>
            <div className="stat-sub muted">{filtered.filter(t => getAmount(t) < 0).length} lançamentos</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Saldo</div>
            <div className="stat-value">{formatCurrency(summary.balance)}</div>
            <div className="stat-sub muted">{filtered.length} resultados</div>
          </div>
        </div>

        <div className="card report-card wide">
          <h3>Evolução (gráfico)</h3>
          <div className="chart-placeholder">(Gráfico interativo pode ser integrado aqui)</div>
        </div>

        <div className="card report-card">
          <h3>Transações</h3>

          {visible.length === 0 ? (
            <p className="muted">Nenhuma transação encontrada para os filtros selecionados.</p>
          ) : (
            <ul className="transactions">
              {visible.map(tx => {
                const amt = getAmount(tx);
                const expense = amt < 0;
                const display = formatCurrency(Math.abs(amt));
                return (
                  <li key={tx.id ?? `${tx.date}-${tx.amount}`} className="tx">
                    <div className="tx-left">
                      <div className="title" title={tx.title ?? tx.description ?? 'Transação'}>
                        {tx.title ?? tx.description ?? 'Transação'}
                      </div>
                      <div className="meta">{tx.date ? new Date(tx.date).toLocaleString() : (tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '')} • {tx.category || '—'}</div>
                    </div>

                    <div className={`amount ${expense ? 'debit' : 'credit'}`}>
                      {expense ? `- ${display}` : display}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="pagination">
            <div className="page-controls">
              <label>Por página:
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[6,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>

            <div className="pages">
              <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
              <span>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}