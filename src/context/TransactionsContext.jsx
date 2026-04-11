import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useTransactions as useRealTransactions } from '../hooks/useTransactions';
import { useAuth } from './AuthContext';

const TransactionsContext = createContext();

// Hook interno que só roda quando existe usuário autenticado
function TransactionsLoader({ children }) {
  const txState = useRealTransactions();
  const value = useMemo(() => txState, [txState]);

  // Carrega os dados uma única vez quando o componente monta (usuário autenticado)
  useEffect(() => {
    txState.refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] garante execução única - refresh é estável por useCallback

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