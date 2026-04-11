import React, { createContext, useContext, useMemo } from 'react';
import { useTransactions as useRealTransactions } from '../hooks/useTransactions';
import { useAuth } from './AuthContext';

const TransactionsContext = createContext();

// Hook interno que só roda quando existe usuário autenticado
function TransactionsLoader({ children }) {
  const txState = useRealTransactions();
  const value = useMemo(() => txState, [txState]);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

// Estado vazio para quando o usuário não está autenticado
const emptyState = {
  transactions: [],
  accounts: [],
  loading: false,
  error: null,
  addTransaction: async () => {},
  removeTransaction: async () => {},
  updateTransaction: async () => {},
  fetchAccounts: async () => {},
  getBalance: () => 0,
  refresh: () => {},
};

export function TransactionsProvider({ children }) {
  const { user, loadingInitial } = useAuth();

  // Se não há usuário, provê estado vazio e não faz requisições
  if (!user || loadingInitial) {
    return (
      <TransactionsContext.Provider value={emptyState}>
        {children}
      </TransactionsContext.Provider>
    );
  }

  return <TransactionsLoader>{children}</TransactionsLoader>;
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactionsContext deve ser usado dentro de um TransactionsProvider');
  }
  return context;
}