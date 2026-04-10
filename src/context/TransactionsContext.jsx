import React, { createContext, useContext, useMemo } from 'react';
import { useTransactions as useLocalTransactions } from '../hooks/useTransactions';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const tx = useLocalTransactions(); // pode ser array ou objeto

  const normalized = useMemo(() => {
    // se o hook retornar diretamente um array -> tratamos como transactions
    if (Array.isArray(tx)) {
      return {
        transactions: tx,
        addTransaction: () => console.warn('addTransaction não implementado'),
        removeTransaction: () => console.warn('removeTransaction não implementado'),
        updateTransaction: () => console.warn('updateTransaction não implementado'),
        getBalance: () => tx.reduce((s, t) => s + ((t.type === 'income' ? 1 : -1) * Number(t.amount || 0)), 0),
      };
    }

    // se for objeto, normaliza nomes comuns
    const transactions = (tx && (tx.transactions || tx.items || tx.list)) || [];
    const addTransaction = (tx && (tx.addTransaction || tx.createTransaction || tx.add)) || (() => console.warn('addTransaction não implementado'));
    const removeTransaction = (tx && (tx.removeTransaction || tx.deleteTransaction || tx.remove || tx.delete)) || (() => console.warn('removeTransaction não implementado'));
    const updateTransaction = (tx && (tx.updateTransaction || tx.editTransaction || tx.update)) || (() => console.warn('updateTransaction não implementado'));
    const getBalance =
      (tx && tx.getBalance) ||
      (() => {
        try {
          return transactions.reduce((s, t) => s + ((t.type === 'income' ? 1 : -1) * Number(t.amount || 0)), 0);
        } catch (e) {
          return 0;
        }
      });

    return {
      transactions,
      addTransaction,
      removeTransaction,
      updateTransaction,
      getBalance,
      // espalha o objeto original para manter outras helpers/flags
      ...(tx || {}),
    };
  }, [tx]);

  // debug: comente se não quiser ver no console
  console.debug('TransactionsContext provider normalized value:', normalized);

  return <TransactionsContext.Provider value={normalized}>{children}</TransactionsContext.Provider>;
}

export function useTransactionsContext() {
  return useContext(TransactionsContext);
}