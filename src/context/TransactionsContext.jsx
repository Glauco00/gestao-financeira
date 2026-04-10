import React, { createContext, useContext, useMemo } from 'react';
import { useTransactions as useRealTransactions } from '../hooks/useTransactions';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const txState = useRealTransactions();

  // O txState já contém as funções assíncronas reais e o estado compartilhado
  return (
    <TransactionsContext.Provider value={txState}>
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