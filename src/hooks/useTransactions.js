import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchTransactions(filters);
      // O backend retorna { success: true, data: { transactions: [] } }
      // api.js fetchTransactions faz: return response.data.data.transactions;
      setTransactions(data || []);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Falha ao carregar transações.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (txData) => {
    try {
      setLoading(true);
      const newTx = await api.addTransaction(txData);
      setTransactions((prev) => [newTx, ...prev]);
      return newTx;
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTransaction = async (id) => {
    try {
      setLoading(true);
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (txData) => {
    if (!txData.id) return;
    try {
      setLoading(true);
      const updated = await api.updateTransaction(txData.id, txData);
      setTransactions((prev) => prev.map((t) => (t.id === txData.id ? updated : t)));
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBalance = () =>
    transactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );

  // Carregar inicialmente
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    removeTransaction, 
    updateTransaction, 
    getBalance,
    refresh: fetchTransactions 
  };
}

export default useTransactions;