import React, { createContext, useContext, useMemo } from 'react';
import { useTransactions as useRealTransactions } from '../hooks/useTransactions';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const txState = useRealTransactions();

  // Memoizamos o valor para garantir que o contexto só mude se o estado real mudar
  const value = useMemo(() => txState, [txState]);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactionsContext deve ser usado dentro de um TransactionsProvider');
  }
  return context;
}