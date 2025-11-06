import React, { createContext, useContext } from 'react';
import { useTransactions as useLocalTransactions } from '../hooks/useTransactions';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  // useLocalTransactions já persiste em localStorage
  const tx = useLocalTransactions();
  return (
    <TransactionsContext.Provider value={tx}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  return useContext(TransactionsContext);
}