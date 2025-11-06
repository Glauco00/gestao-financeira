import { useState, useEffect } from 'react';

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem('transactions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch {
      /* ignore */
    }
  }, [transactions]);

  const addTransaction = (tx) =>
    setTransactions((prev) => [{ id: Date.now(), ...tx }, ...prev]);

  const removeTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const getBalance = () =>
    transactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );

  return { transactions, addTransaction, removeTransaction, getBalance };
}

export default useTransactions;