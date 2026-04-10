import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchTransactions(filters);
      setTransactions(data || []);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Falha ao carregar transações.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.fetchAccounts();
      setAccounts(data || []);
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (txData) => {
    try {
      setLoading(true);
      const newTx = await api.addTransaction(txData);
      setTransactions((prev) => [newTx, ...prev]);
      if (txData.account_id) fetchAccounts();
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
      fetchAccounts();
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
      fetchAccounts();
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refresh = useCallback(() => {
    fetchTransactions();
    fetchAccounts();
  }, [fetchTransactions, fetchAccounts]);

  const getBalance = useCallback(() => {
    if (!Array.isArray(accounts)) return 0;
    return accounts.reduce((acc, a) => acc + Number(a.balance || 0), 0);
  }, [accounts]);

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, [fetchTransactions, fetchAccounts]);

  return useMemo(() => ({ 
    transactions, 
    accounts,
    loading, 
    error, 
    addTransaction, 
    removeTransaction, 
    updateTransaction, 
    fetchAccounts,
    getBalance,
    refresh
  }), [transactions, accounts, loading, error, refresh, getBalance]);
}

export default useTransactions;